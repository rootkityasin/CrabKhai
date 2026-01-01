import { PrismaClient } from '@prisma/client';

console.log("Debugging Prisma constructor...");
try {
    console.log("Test 1: Empty constructor");
    new PrismaClient();
    console.log("Test 1: Success");
} catch (e: any) {
    console.log("Error 1: " + e.message);
}

try {
    console.log("Test 2: Log only");
    new PrismaClient({ log: ['info'] });
    console.log("Test 2: Success");
} catch (e: any) {
    console.log("Error 2: " + e.message);
}

try {
    console.log("Test 3: datasources");
    // @ts-ignore
    new PrismaClient({ datasources: { db: { url: 'postgresql://u:p@h:5432/db' } } });
    console.log("Test 3: Success");
} catch (e: any) {
    console.log("Error 3: " + e.message);
}

try {
    console.log("Test 4: datasourceUrl");
    // @ts-ignore
    new PrismaClient({ datasourceUrl: 'postgresql://u:p@h:5432/db' });
    console.log("Test 4: Success");
} catch (e: any) {
    console.log("Error 4: " + e.message);
}

try {
    console.log("Test 5: Explicit Config Object?");
    // @ts-ignore
    new PrismaClient({ datasource: { url: 'postgresql://u:p@h:5432/db' } });
    console.log("Test 5: Success");
} catch (e: any) {
    console.log("Error 5: " + e.message);
}
