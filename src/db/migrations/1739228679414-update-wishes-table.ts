import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWishesTable1739228679414 implements MigrationInterface {
    name = 'UpdateWishesTable1739228679414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishes" ADD "recommanded" boolean`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."wishes_status_enum" AS ENUM('A assistir', 'Assistido', 'Avaliado', 'Recomendado')`);
        await queryRunner.query(`ALTER TABLE "wishes" ADD "status" "public"."wishes_status_enum" NOT NULL DEFAULT 'A assistir'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."wishes_status_enum"`);
        await queryRunner.query(`ALTER TABLE "wishes" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "recommanded"`);
    }

}
