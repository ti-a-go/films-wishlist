import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFilmsTable1739049162086 implements MigrationInterface {
    name = 'CreateFilmsTable1739049162086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "films" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "year" character varying(4) NOT NULL, "language" character varying(5) NOT NULL, "synopse" character varying(511) NOT NULL, "status" character varying NOT NULL DEFAULT 'À assistir', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_697487ada088902377482c970d1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "films"`);
    }

}
