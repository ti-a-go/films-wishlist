import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLogsTable1739238699208 implements MigrationInterface {
    name = 'UpdateLogsTable1739238699208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "timestamp" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "timestamp" integer NOT NULL`);
    }

}
