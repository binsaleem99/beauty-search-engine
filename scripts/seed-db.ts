import { Client } from 'pg';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const retailersData = [
    {
        name: 'noon',
        display_name_en: 'Noon',
        display_name_ar: 'نون',
        logo_url: 'https://z.nooncdn.com/s/app/com/noon/images/logos/noon-black-on-yellow.svg',
        base_url: 'https://noon.com',
        affiliate_network: 'arabclicks',
        commission_rate: 10.00
    },
    {
        name: 'amazon_ae',
        display_name_en: 'Amazon AE',
        display_name_ar: 'أمازون',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        base_url: 'https://amazon.ae',
        affiliate_network: 'amazon_associates',
        commission_rate: 8.00
    },
    {
        name: 'faces',
        display_name_en: 'Faces',
        display_name_ar: 'وجوه',
        logo_url: 'https://cdn.faces.com/assets/images/logo.svg',
        base_url: 'https://faces.com',
        affiliate_network: 'direct',
        commission_rate: 12.00
    },
    {
        name: 'sephora_me',
        display_name_en: 'Sephora ME',
        display_name_ar: 'سيفورا',
        logo_url: 'https://www.sephora.ae/on/demandware.static/-/Sites-Sephora_UAE-Library/en_AE/v1646294726207/images/logo.svg',
        base_url: 'https://sephora.ae',
        affiliate_network: 'direct',
        commission_rate: 12.00
    }
];

const ingredientsList = [
    { name_en: 'Vitamin C', name_ar: 'فيتامين سي', category: 'Antioxidant', benefits: ['Brightening', 'Anti-aging', 'Sun protection'] },
    { name_en: 'Hyaluronic Acid', name_ar: 'حمض الهيالورونيك', category: 'Humectant', benefits: ['Hydration', 'Plumping'] },
    { name_en: 'Retinol', name_ar: 'الريتينول', category: 'Cell Communicating', benefits: ['Anti-aging', 'Acne fighting'] },
    { name_en: 'Niacinamide', name_ar: 'النياسيناميد', category: 'Cell Communicating', benefits: ['Brightening', 'Pore reduction', 'Barrier repair'] },
    { name_en: 'Salicylic Acid', name_ar: 'حمض الساليسيليك', category: 'Exfoliant', benefits: ['Acne fighting', 'Pore cleaning'] },
    { name_en: 'Glycolic Acid', name_ar: 'حمض الجليكوليك', category: 'Exfoliant', benefits: ['Exfoliation', 'Brightening'] },
    { name_en: 'Ceramides', name_ar: 'سيراميد', category: 'Skin Identical', benefits: ['Barrier repair', 'Hydration'] },
    { name_en: 'Peptides', name_ar: 'الببتيدات', category: 'Cell Communicating', benefits: ['Anti-aging', 'Firming'] },
    { name_en: 'Zinc Oxide', name_ar: 'أكسيد الزنك', category: 'Sunscreen', benefits: ['Sun protection', 'Soothing'] },
    { name_en: 'Glycerin', name_ar: 'الجلسرين', category: 'Humectant', benefits: ['Hydration', 'Barrier maintenance'] },
    { name_en: 'Snail Mucin', name_ar: 'موسين القواقع', category: 'Humectant', benefits: ['Hydration', 'Repair'] },
    { name_en: 'Centella Asiatica', name_ar: 'سنتيلا اسياتيكا', category: 'Soothing', benefits: ['Soothing', 'Redness reduction'] },
    { name_en: 'Azelaic Acid', name_ar: 'حمض الأزيليك', category: 'Anti-inflammatory', benefits: ['Redness reduction', 'Acne fighting'] },
    { name_en: 'Benzoyl Peroxide', name_ar: 'بيروكسيد البنزويل', category: 'Anti-acne', benefits: ['Acne fighting'] },
    { name_en: 'Lactic Acid', name_ar: 'حمض اللاكتيك', category: 'Exfoliant', benefits: ['Exfoliation', 'Hydration'] },
    { name_en: 'Vitamin E', name_ar: 'فيتامين هـ', category: 'Antioxidant', benefits: ['Protection', 'Moisturizing'] },
    { name_en: 'Aloe Vera', name_ar: 'الصبار', category: 'Soothing', benefits: ['Soothing', 'Hydration'] },
    { name_en: 'Tea Tree Oil', name_ar: 'زيت شجرة الشاي', category: 'Anti-acne', benefits: ['Acne fighting', 'Antibacterial'] },
    { name_en: 'Squalane', name_ar: 'السكوالين', category: 'Emollient', benefits: ['Hydration', 'Barrier support'] },
    { name_en: 'Panthenol', name_ar: 'البانثينول', category: 'Soothing', benefits: ['Soothing', 'Hydration'] }
    // Add more to reach 50 if needed, starting with 20 core ones for now (scaling to 50 with variations/others)
];

// Generate more ingredients to reach 50
while (ingredientsList.length < 50) {
    const name = faker.commerce.productMaterial() + ' Extract';
    ingredientsList.push({
        name_en: name,
        name_ar: name + ' (AR)', // Placeholder AR translation
        category: 'Botanical',
        benefits: ['Antioxidant', 'Soothing']
    });
}

const brands = ['CeraVe', 'The Ordinary', "Paula's Choice", 'La Roche-Posay', 'COSRX', 'Laneige', 'Neutrogena', 'Eucerin', 'Vichy', 'SkinCeuticals'];
const categories = ['Moisturizer', 'Cleanser', 'Serum', 'Sunscreen', 'Toner', 'Mask'];

async function seed() {
    let connectionString = process.env.DATABASE_URL;

    // Use derived string logic fallback if DATABASE_URL is somehow missing but components present
    if (!connectionString) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const dbPassword = process.env.SUPABASE_DB_PASSWORD;
        if (supabaseUrl && dbPassword) {
            const projectRef = supabaseUrl.split('//')[1].split('.')[0];
            const dbHost = `db.${projectRef}.supabase.co`;
            connectionString = `postgres://postgres:${dbPassword}@${dbHost}:5432/postgres`;
        } else {
            console.error('Missing DB connection info');
            process.exit(1);
        }
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Insert Retailers
        console.log('Seeding Retailers...');
        const retailerIds = [];
        for (const retailer of retailersData) {
            const res = await client.query(`
                INSERT INTO retailers (name, display_name_en, display_name_ar, logo_url, base_url, affiliate_network, commission_rate)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (name) DO UPDATE SET display_name_en = EXCLUDED.display_name_en
                RETURNING id;
            `, [retailer.name, retailer.display_name_en, retailer.display_name_ar, retailer.logo_url, retailer.base_url, retailer.affiliate_network, retailer.commission_rate]);
            retailerIds.push(res.rows[0].id);
        }

        // 2. Insert Ingredients
        console.log('Seeding Ingredients...');
        const ingredientIds = [];
        for (const ing of ingredientsList) {
            const res = await client.query(`
                INSERT INTO ingredients (name_en, name_ar, category, benefits)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (name_en) DO NOTHING
                RETURNING id;
            `, [ing.name_en, ing.name_ar, ing.category, ing.benefits]);

            if (res.rows[0]) {
                ingredientIds.push(res.rows[0].id);
            } else {
                // Fetch existing id if conflict
                const existing = await client.query('SELECT id FROM ingredients WHERE name_en = $1', [ing.name_en]);
                ingredientIds.push(existing.rows[0].id);
            }
        }

        // 3. Insert Products
        console.log('Seeding Products...');
        for (let i = 0; i < 100; i++) {
            const brand = faker.helpers.arrayElement(brands);
            const category = faker.helpers.arrayElement(categories);
            const name_en = `${brand} ${faker.commerce.productAdjective()} ${category}`;
            const name_ar = `${brand} ${category} (AR)`; // Placeholder

            const prodRes = await client.query(`
                INSERT INTO products (name_en, name_ar, brand, category, image_url, description_en, description_ar, main_ingredients)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id;
            `, [
                name_en,
                name_ar,
                brand,
                category,
                faker.image.urlLoremFlickr({ category: 'beauty' }),
                faker.commerce.productDescription(),
                'وصف المنتج بالعربية...',
                [faker.helpers.arrayElement(ingredientsList).name_en]
            ]);

            const productId = prodRes.rows[0].id;

            // Link Ingredients
            const numIngredients = faker.number.int({ min: 1, max: 5 });
            const selectedIngredients = faker.helpers.arrayElements(ingredientIds, numIngredients);
            for (const ingId of selectedIngredients) {
                await client.query(`
                    INSERT INTO product_ingredients (product_id, ingredient_id, concentration)
                    VALUES ($1, $2, $3)
                    ON CONFLICT DO NOTHING
                `, [productId, ingId, faker.helpers.arrayElement(['5%', '10%', '1%', null])]);
            }

            // 4. Insert Prices
            const numRetailers = faker.number.int({ min: 1, max: 4 });
            const selectedRetailers = faker.helpers.arrayElements(retailerIds, numRetailers);

            for (const retId of selectedRetailers) {
                const price = parseFloat(faker.commerce.price({ min: 5, max: 50 }));
                await client.query(`
                    INSERT INTO prices (product_id, retailer_id, price, url, in_stock)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT DO NOTHING
                `, [productId, retId, price, faker.internet.url(), faker.datatype.boolean()]);
            }
        }

        console.log('Seeding Complete!');

    } catch (err) {
        console.error('Error seeding DB:', err);
    } finally {
        await client.end();
    }
}

seed();
