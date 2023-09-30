import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Hospital, Doctor, Admin } from '../../models';

const data = [
  ...require('../../../data/1-1999.json'),
  ...require('../../../data/2000-2999.json'),
  ...require('../../../data/3000-3999.json'),
  ...require('../../../data/4000-4999.json'),
]

export default class CreateHospitals implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
      await connection
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values([{ id: 3, nick: 'wangchengkai', open_id: '123' }])
      .execute();
    // for (let i = 0, len = data.length; i < len; i ++) {
    //   console.log('\nprocessing hospital index: ' + i);
    //   const hospital: Hospital = data[i];
    //   const doctors: Doctor[] = hospital['doctors'];
    //   doctors.forEach(d => d.hospital_id === hospital.id);
    //   await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Hospital)
    //   .values([hospital])
    //   .execute();

    //   if (doctors && doctors.length) {
    //     await connection
    //     .createQueryBuilder()
    //     .insert()
    //     .into(Doctor)
    //     .values(doctors)
    //     .execute();
    //   }
    // }
  }
}
