import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1739241306399 implements MigrationInterface {
    name = 'CreateTables1739241306399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "films" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "year" character varying(4) NOT NULL, "language" character varying(5) NOT NULL, "synopse" character varying(511) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_697487ada088902377482c970d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wishes_status_enum" AS ENUM('A assistir', 'Assistido', 'Avaliado', 'Recomendado')`);
        await queryRunner.query(`CREATE TABLE "wishes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."wishes_status_enum" NOT NULL DEFAULT 'A assistir', "recommanded" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "wishlistId" uuid, "filmId" uuid, CONSTRAINT "PK_9c08d144e42ca0aa37a024597ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "wishlistId" uuid, CONSTRAINT "REL_0a6811dfb5cec2ebe119587a37" UNIQUE ("wishlistId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying(10) NOT NULL, "status" integer NOT NULL, "url" character varying(100) NOT NULL, "timestamp" character varying(20) NOT NULL, "film_ids" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wishes" ADD CONSTRAINT "FK_b0bcfd3759f06fece868c91b782" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishes" ADD CONSTRAINT "FK_8d178cd0d9e85c2cdac392670c1" FOREIGN KEY ("filmId") REFERENCES "films"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0a6811dfb5cec2ebe119587a37d" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0a6811dfb5cec2ebe119587a37d"`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP CONSTRAINT "FK_8d178cd0d9e85c2cdac392670c1"`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP CONSTRAINT "FK_b0bcfd3759f06fece868c91b782"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "wishlists"`);
        await queryRunner.query(`DROP TABLE "wishes"`);
        await queryRunner.query(`DROP TYPE "public"."wishes_status_enum"`);
        await queryRunner.query(`DROP TABLE "films"`);
    }

}
