// device_rs485_parser.js (TX4S Auto Detect 최종 개선 버전)
import { calculateCRC16Modbus } from './device_rs485.js';

/**
 * TX4S 응답 패킷에서 현재값(PV) 추출 + buffer log + pv log 출력
 * @param {Uint8Array} buffer - 수신된 RS485 응답 데이터
 * @returns {number|null} PV 값, 에러 시 null
 */
export function parseTX4SResponse(buffer) {
  console.log(
    '[DEBUG] Raw buffer:',
    Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
  );

  if (buffer.length < 7) return null;

  // Slave ID + Function Code 확인
  if (buffer[0] !== 0x01 || buffer[1] !== 0x04) return null;

  // CRC 검사
  const dataWithoutCRC = buffer.slice(0, buffer.length - 2);
  const receivedCRC =
    (buffer[buffer.length - 1] << 8) | buffer[buffer.length - 2];
  const calculatedCRC = calculateCRC16Modbus(dataWithoutCRC);
  if (receivedCRC !== calculatedCRC) {
    console.warn(
      `[WARNING] CRC 오류 → 받은 CRC: ${receivedCRC.toString(
        16
      )}, 계산 CRC: ${calculatedCRC.toString(16)}`
    );
    return null;
  }

  // Auto detect: ByteCount 위치 찾기
  // 일반적으로 ByteCount는 [2] 위치지만 Echo 포함시 밀릴 수 있음 → 모든 위치 scan
  let dataStart = -1;
  for (let i = 2; i < buffer.length - 4; i++) {
    const byteCount = buffer[i];
    if (byteCount === 2 && i + 4 <= buffer.length) {
      // 예상 구조: [ID][FUNC][...Echo][ByteCount=2][Data_H][Data_L][CRC_L][CRC_H]
      dataStart = i + 1;
      break;
    }
  }

  if (dataStart === -1) {
    console.warn('[WARNING] Data 위치를 찾을 수 없음 (ByteCount=2 없음)');
    return null;
  }

  // Data 추출
  const pvRaw = (buffer[dataStart] << 8) | buffer[dataStart + 1];
  const pvValue = pvRaw >= 0x8000 ? pvRaw - 0x10000 : pvRaw;

  console.log(`[DEBUG] TX4S 현재값: ${pvValue}`);
  return pvValue;
}
