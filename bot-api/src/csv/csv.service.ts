import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);
  async read<T = Record<string, string>>(fileName: string): Promise<T[]> {
    try {
      // The csv file is read and provides the rows list
      return new Promise((resolve, reject) => {
        const path = join(process.cwd(), 'src', 'data', fileName);

        const rows: T[] = [];

        createReadStream(path)
          .pipe(csvParser())
          .on('data', (row) => rows.push(row))
          .on('end', () => resolve(rows))
          .on('error', (error) =>
            reject(
              new InternalServerErrorException(
                `Error reading CSV file "${fileName}".`,
                {
                  cause: error,
                },
              ),
            ),
          );
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Error reading CSV file: "${fileName}": ${axiosError.message}`,
      );
      return [];
    }
  }
}
