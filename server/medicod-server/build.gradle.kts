// 👇 Necesario para la DSL de jOOQ en Kotlin
import org.jooq.meta.jaxb.Database
import org.jooq.meta.jaxb.Generate
import org.jooq.meta.jaxb.Generator
import org.jooq.meta.jaxb.Jdbc
import org.jooq.meta.jaxb.Target

plugins {
    id("java")
    id("org.springframework.boot") version "3.3.5"
    id("io.spring.dependency-management") version "1.1.6"
    id("nu.studer.jooq") version "9.0"
}

group = "medicod"
version = "1.0-SNAPSHOT"

repositories { mavenCentral() }

java {
    toolchain { languageVersion.set(JavaLanguageVersion.of(21)) }
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-jooq")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("org.mindrot:jbcrypt:0.4")
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")

    implementation("org.jooq:jooq:3.19.19")

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testCompileOnly("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")

    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")
    runtimeOnly("com.mysql:mysql-connector-j")

    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    jooqGenerator("org.jooq:jooq-meta:3.19.19")
    jooqGenerator("org.jooq:jooq-codegen:3.19.19")
    jooqGenerator("com.mysql:mysql-connector-j:8.4.0")
}

jooq {
    configurations {
        create("main") {
            generateSchemaSourceOnCompilation.set(true)

            jooqConfiguration.apply {
                jdbc = Jdbc()
                    .withDriver("com.mysql.cj.jdbc.Driver")
                    .withUrl("jdbc:mysql://localhost:3306/medicod")
                    .withUser("root")
                    .withPassword("123abc")

                generator = Generator().apply {
                    name = "org.jooq.codegen.DefaultGenerator"
                    database = Database().apply {
                        name = "org.jooq.meta.mysql.MySQLDatabase"
                        inputSchema = "medicod"
                        includes = ".*"
                        excludes = ""
                    }
                    generate = Generate().apply {
                        isRecords = true
                        isDaos = true
                        isPojos = true
                        isFluentSetters = true
                    }
                    target = Target().apply {
                        packageName = "com.medicod.database"
                        directory = "${buildDir}/generated-sources/jooq-classes"
                    }
                }
            }
        }
    }
}

tasks.test { useJUnitPlatform() }
