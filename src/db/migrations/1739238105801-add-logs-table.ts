import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogsTable1739238105801 implements MigrationInterface {
    name = 'AddLogsTable1739238105801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying(10) NOT NULL, "status" integer NOT NULL, "url" character varying(10) NOT NULL, "timestamp" integer NOT NULL, "film_ids" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
