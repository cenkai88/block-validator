import CryptoJs from "crypto-js";

const MINI_CHUNK_SIZE = 5 * 1024 * 1024;

// NOTE: 计算函数
// 预设: s3每个分片最小为5MB, 最大5GB, 最大长度10,000 chunks,
// 假设 平均上传速率 40Mbps (5MB/s) 进度条最小单位1%, 预期最小等待进度变化: 2-3s , 一小时最大上传量: 5MB * 3600 = 18GB
// 三个chunk size: 1% filesize, 2s * 40Mbps = 10MB, MINI_CHUNK_SIZE = 5MB
// 0 ~ 5MB, 1 chunk
// 5Mb ~ 100Mb, 5 MB/chunk
// 100Mb ~ 1GB, 10 MB/chunk
// > 1GB,  1% filesize/chunk ( start from 10MB/chunk)
// > 50GB, 后 1% filesize > 500MB/chunk 因此直接使用 500MB/chunk
// 注意: max chunk size: 1GB 因为本地机能限制, Buffer最大为1GB (32位下, 64位下为2GB)
export function getChunkSize(fileSize) {
  // < 5MB, 1 chunk
  if (fileSize < MINI_CHUNK_SIZE) return MINI_CHUNK_SIZE;
  // 5MB ~ 100MB, 5MB/chunk
  if (fileSize < 100 * 1024 * 1024) return MINI_CHUNK_SIZE;
  // 100MB ~ 1GB, 10MB/chunk
  if (fileSize < 1024 * 1024 * 1024) return 10 * 1024 * 1024;
  // > 1GB, 1% filesize/chunk ( start from 10MB/chunk)
  if (fileSize < 50 * 1024 * 1024 * 1024) {
    // 这里的逻辑都是为了最终parts数量是100个
    const isInteger = Number.isInteger(fileSize / 100);
    if (isInteger) return fileSize / 100;
    // 能不能被99整除, 不能的话就取整数部分 - 1 来保证最终parts数量是100个
    const isInteger2 = Number.isInteger(fileSize / 99);
    if (isInteger2) {
      return fileSize / 99 - 1;
    } else {
      return Math.floor(fileSize / 99);
    }
  }
  // > 50GB, 后 1% filesize > 500MB/chunk 因此直接使用 500MB/chunk
  return 500 * 1024 * 1024;
}

export function generateETag(arrayBuffer) {
  const fileSizeInBytes = arrayBuffer.byteLength;
  const partSizeInBytes = getChunkSize(fileSizeInBytes);

  let partCount = Math.floor(fileSizeInBytes / partSizeInBytes);
  if (fileSizeInBytes % partSizeInBytes > 0) {
    partCount += 1;
  }
  let totalMd5 = "";

  for (let part = 0; part < partCount; part++) {
    const skipBytes = partSizeInBytes * part;
    const totalBytesLeft = fileSizeInBytes - skipBytes;
    const bytesToRead = Math.min(totalBytesLeft, partSizeInBytes);
    const chunk = new Uint8Array(arrayBuffer, skipBytes, bytesToRead);
    const proof = CryptoJs.MD5(CryptoJs.lib.WordArray.create(chunk)).toString();
    totalMd5 += proof;
  }

  const combinedHash = CryptoJs.MD5(CryptoJs.enc.Hex.parse(totalMd5)).toString();
  const etag = `${combinedHash}-${partCount}`;
  return etag;
}
