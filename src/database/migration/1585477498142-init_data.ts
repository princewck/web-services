import {MigrationInterface, QueryRunner, createQueryBuilder} from "typeorm";
import { Hospital, Doctor, User } from '../../models';
import * as chalk from 'chalk';
import { format } from 'date-fns';

const data = [
    ...require('../../../data/1-1999.json'),
    ...require('../../../data/2000-2999.json'),
    ...require('../../../data/3000-3999.json'),
    ...require('../../../data/4000-4999.json'),
  ]


export class initData1585477498142 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        for (let i = 0, len = data.length; i < len; i ++) {
            const hospital: Hospital = data[i];
            hospital.created_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            hospital.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const doctors: Doctor[] = hospital['doctors'];
            console.log(chalk.yellow('\nprocessing hospital id: ' + hospital.id));
            await createQueryBuilder('hospitals')
            .insert()
            .into(Hospital)
            .values([hospital])
            .execute();

            if (doctors && doctors.length) {
                doctors.forEach(d => {
                    console.log('hospital.id', hospital.id);
                    d.hospital_id = hospital.id
                    d.created_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    d.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
                });
                await createQueryBuilder('doctors')
                .insert()
                .into(Doctor)
                .values(doctors)
                .execute();
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
