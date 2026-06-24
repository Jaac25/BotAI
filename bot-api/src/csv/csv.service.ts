import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import csvParser from 'csv-parser';

@Injectable()
export class CsvService {
  async read<T = Record<string, string>>(fileName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const path = join(process.cwd(), 'src', 'data', fileName);

      if (!existsSync(path)) {
        return reject(
          new NotFoundException(`CSV file "${fileName}" not found.`),
        );
      }

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
  }
}
