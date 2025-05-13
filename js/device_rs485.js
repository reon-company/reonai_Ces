// device_rs485.js (Reonai Studio + TX4S Test Panel 최종 통합 버전)

let port = null;
let reader = null;
let writer = null;

/**
 * RS485 포트 연결
 */
export async function connectRS485(baudRate = 9600) {
  try {
    port = await navigator.serial.requestPort();
    await port.open({
      baudRate,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: 'none',
    });
    reader = port.readable.getReader();
    writer = port.writable.getWriter();
    console.log('RS-485 포트 연결 성공 (TX4S)');
    return true;
  } catch (error) {
    console.error('포트 연결 실패:', error);
    return false;
  }
}

/**
 * RS485 포트 해제
 */
export async function disconnectRS485() {
  try {
    if (reader) await reader.releaseLock();
    if (writer) await writer.releaseLock();
    if (port) await port.close();
    console.log('RS-485 포트 해제 완료');
  } catch (error) {
    console.error('포트 해제 실패:', error);
  } finally {
    port = null;
    reader = null;
    writer = null;
  }
}

/**
 * RS485로 명령어 전송
 */
export async function sendRS485Command(commandBytes) {
  if (!writer) throw new Error('포트가 연결되지 않았습니다.');
  try {
    await writer.write(commandBytes);
  } catch (error) {
    console.error('명령어 전송 실패:', error);
  }
}

/**
 * RS485로부터 응답 읽기
 */
export async function readRS485Response(expectedLength = 8, timeoutMs = 1000) {
  if (!reader) throw new Error('포트가 연결되지 않았습니다.');
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Read timeout')), timeoutMs)
  );
  const readPromise = (async () => {
    let received = new Uint8Array(expectedLength);
    let bytesRead = 0;
    while (bytesRead < expectedLength) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        received.set(value, bytesRead);
        bytesRead += value.length;
      }
    }
    return received.slice(0, bytesRead);
  })();
  return Promise.race([readPromise, timeoutPromise]);
}

/**
 * Modbus CRC16 계산 함수
 */
export function calculateCRC16Modbus(buffer) {
  let crc = 0xffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 0x0001) {
        crc >>= 1;
        crc ^= 0xa001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}

/**
 * TX4S Input Register Read 명령어 생성
 * 실시간으로 address 변경 가능
 * 기본값 address = 0x03E9 (TX4S PV 주소)
 */
export function buildTX4SReadPVCommand(slaveId = 1, address = 0x03e8) {
  console.log(address);
  const cmd = new Uint8Array([
    slaveId,
    0x04,
    (address >> 8) & 0xff,
    address & 0xff,
    0x00,
    0x01,
  ]);

  const crc = calculateCRC16Modbus(cmd);

  return new Uint8Array([...cmd, crc & 0xff, (crc >> 8) & 0xff]);
}

/**
 * 디버그 테스트용 (단일 Read 테스트)
 * 실시간 address 입력 가능
 */
export async function debugWriteAndReadAny(address = 0x03e8, timeoutMs = 1000) {
  console.log(address);
  if (!writer || !reader) throw new Error('포트가 연결되지 않았습니다.');
  try {
    await writer.write(buildTX4SReadPVCommand(1, address));
  } catch (error) {
    console.error('디버그 명령어 전송 실패:', error);
  }
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Read timeout')), timeoutMs)
  );
  const readPromise = (async () => {
    const { value, done } = await reader.read();
    if (done || !value) return new Uint8Array();
    return value;
  })();
  return Promise.race([readPromise, timeoutPromise]);
}
