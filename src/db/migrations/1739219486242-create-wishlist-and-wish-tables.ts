import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWishlistAndWishTables1739219486242 implements MigrationInterface {
    name = 'CreateWishlistAndWishTables1739219486242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wishes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "wishlistId" uuid, "filmId" uuid, CONSTRAINT "PK_9c08d144e42ca0aa37a024597ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "films" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "wishlistId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_0a6811dfb5cec2ebe119587a37d" UNIQUE ("wishlistId")`);
        await queryRunner.query(`ALTER TABLE "wishes" ADD CONSTRAINT "FK_b0bcfd3759f06fece868c91b782" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishes" ADD CONSTRAINT "FK_8d178cd0d9e85c2cdac392670c1" FOREIGN KEY ("filmId") REFERENCES "films"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0a6811dfb5cec2ebe119587a37d" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0a6811dfb5cec2ebe119587a37d"`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP CONSTRAINT "FK_8d178cd0d9e85c2cdac392670c1"`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP CONSTRAINT "FK_b0bcfd3759f06fece868c91b782"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_0a6811dfb5cec2ebe119587a37d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "wishlistId"`);
        await queryRunner.query(`ALTER TABLE "films" ADD "status" character varying NOT NULL DEFAULT 'À assistir'`);
        await queryRunner.query(`DROP TABLE "wishlists"`);
        await queryRunner.query(`DROP TABLE "wishes"`);
    }

}
