import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDTO<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  data: T;

  @ApiProperty({ example: '2026-02-05T10:19:16.345Z' })
  timestamp: string;
}

export class FailureResponseDTO {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Invalid Credentials' })
  message: string;

  @ApiProperty({
    example: '2026-02-05T09:23:38.719Z',
  })
  timestamp: string;
}
