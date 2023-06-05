import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateHospitals1585467558229 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'hospitals',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, unsigned: true },
                { name: 'name', type: 'varchar' },
                { name: 'branch_name', type: 'varchar' },
                { name: 'address', type: 'varchar' },
                { name: 'summary', type:  'text'},
                { name: 'telephone', type: 'varchar' },
                { name: 'latitude', type: 'decimal', length: '8', precision: 3 },
                { name: 'longitude', type: 'decimal', length: '8', precision: 3 },
                { name: 'city', type: 'varchar', isNullable: true },
                { name: 'region', type: 'varchar', isNullable: true },
                { name: 'avg_rating', type: 'decimal' },
                { name: 'hours', type: 'varchar' },
                { name: 'avg_price', type: 'decimal' },
                { name: 'comment_total', type: 'int' },
                { name: 'photo_url', type: 'text', isNullable: true },
                { name: 'stages', type: 'int' },
                { name: 'is_insurance', type: 'boolean'},
                { name: 'doctor_total', type: 'int' },
                { name: 'coupon_total', type: 'int' },
                { name: 'created', type: 'bigint' },
                { name: 'created_at', type: 'date' },
                { name: 'updated_at', type: 'date' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'doctors',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, unsigned: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'uid', type: 'int' },
                { name: 'username', type: 'varchar' },
                { name: 'nickname', type: 'varchar' },
                { name: 'name', type: 'varchar' },
                { name: 'gender', type: 'varchar' },
                { name: 'mobile', type: 'varchar' },
                { name: 'job', type: 'varchar' },
                { name: 'introduce', type: 'varchar', isNullable: true },
                { name: 'avatar', type: 'text' },
                { name: 'avg_score', type: 'varchar', isNullable: true },
                { name: 'reply_total', type: 'int' },
                { name: 'fans_total', type: 'int' },
                { name: 'good_total', type: 'int' },
                { name: 'link', type: 'varchar', isNullable: true },
                { name: 'hospital_id', type: 'int' },
                { name: 'created_at', type: 'date' },
                { name: 'updated_at', type: 'date' }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('hospitals');
        await queryRunner.dropTable('doctors');
    }

}
