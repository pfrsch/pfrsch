import pool from '../config/database.js';

async function seedData() {
  try {
    console.log('Seeding database with sample data...');

    // Create sample company
    const companyResult = await pool.query(
      `INSERT INTO companies (name, cnpj, description, logo_url, theme)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [
        'Tech Solutions Co',
        '12345678000190',
        'Professional technology services and consulting',
        'https://via.placeholder.com/200',
        JSON.stringify({
          primaryColor: '#0066ff',
          secondaryColor: '#f2f2f2',
          fontFamily: 'Roboto'
        })
      ]
    );

    const companyId = companyResult.rows[0]?.id || 1;
    console.log('✓ Created sample company');

    // Create sample tags
    const tags = [
      ['Web Development', 'Technology'],
      ['Mobile Development', 'Technology'],
      ['UI/UX Design', 'Design'],
      ['Database Administration', 'Technology'],
      ['DevOps', 'Technology'],
      ['Graphic Design', 'Design'],
      ['Content Writing', 'Marketing'],
      ['SEO Optimization', 'Marketing'],
      ['Cloud Architecture', 'Technology'],
      ['Project Management', 'Management']
    ];

    for (const [name, category] of tags) {
      await pool.query(
        'INSERT INTO tags (name, category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [name, category]
      );
    }
    console.log('✓ Created sample tags');

    // Get tag IDs
    const tagResult = await pool.query('SELECT id FROM tags LIMIT 3');
    const tagIds = tagResult.rows.map(r => r.id);

    // Create sample employees
    const employees = [
      {
        name: 'John Developer',
        email: 'john@techsolutions.com',
        bio: 'Full-stack developer with 10 years of experience in web technologies',
        photo_url: 'https://i.pravatar.cc/200?img=12',
        hourly_rate: 85.00,
        tag_ids: [tagIds[0], tagIds[1]]
      },
      {
        name: 'Sarah Designer',
        email: 'sarah@techsolutions.com',
        bio: 'Creative UI/UX designer passionate about user-centered design',
        photo_url: 'https://i.pravatar.cc/200?img=45',
        hourly_rate: 75.00,
        tag_ids: [tagIds[2]]
      },
      {
        name: 'Mike Consultant',
        email: 'mike@techsolutions.com',
        bio: 'Senior technology consultant specializing in cloud solutions',
        photo_url: 'https://i.pravatar.cc/200?img=33',
        hourly_rate: 95.00,
        tag_ids: [tagIds[0]]
      }
    ];

    for (const emp of employees) {
      const empResult = await pool.query(
        `INSERT INTO employees (company_id, name, photo_url, bio, hourly_rate)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [companyId, emp.name, emp.photo_url, emp.bio, emp.hourly_rate]
      );

      if (empResult.rows.length > 0) {
        const empId = empResult.rows[0].id;

        // Add tags
        for (const tagId of emp.tag_ids) {
          await pool.query(
            'INSERT INTO employee_tags (employee_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [empId, tagId]
          );
        }

        // Add availability (Monday to Friday, 9am-5pm)
        for (let day = 1; day <= 5; day++) {
          await pool.query(
            'INSERT INTO employee_availability (employee_id, weekday, start_time, end_time) VALUES ($1, $2, $3, $4)',
            [empId, day, '09:00', '17:00']
          );
        }
      }
    }
    console.log('✓ Created sample employees with availability');

    // Create sample appointment
    const firstEmp = await pool.query('SELECT id FROM employees LIMIT 1');
    if (firstEmp.rows.length > 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);

      await pool.query(
        `INSERT INTO appointments 
         (employee_id, client_name, client_email, start_timestamp, end_timestamp, status, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          firstEmp.rows[0].id,
          'Test Client',
          'client@example.com',
          tomorrow.toISOString(),
          endTime.toISOString(),
          'confirmed',
          'Initial consultation'
        ]
      );
      console.log('✓ Created sample appointment');
    }

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
