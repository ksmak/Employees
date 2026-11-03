import { db } from "@/app/api/database";

export const migrate = () => {
  db.serialize(() => {
   db.run(
    `
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log("employee table created successfully.");
    }
   );
   db.run(
    `
      INSERT INTO employees (name, position) VALUES
      ('John Doe', 'Software Engineer'),
      ('Jane Smith', 'Product Manager'),
      ('Emily Johnson', 'UX Designer'),
      ('Michael Brown', 'Data Scientist'),
      ('Sarah Davis', 'Marketing Specialist'),
      ('David Wilson', 'Sales Manager'),
      ('Laura Martinez', 'HR Coordinator'),
      ('James Anderson', 'DevOps Engineer'),
      ('Olivia Thomas', 'Business Analyst'),
      ('Robert Jackson', 'Frontend Developer'),
      ('Jennifer White', 'Backend Developer');
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log("Employee data inserted successfully.");
    }
   );
  });
}