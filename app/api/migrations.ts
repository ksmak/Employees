import { db } from "@/app/api/database";

export const migrate = () => {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
      `
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS managements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
      `
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        management_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        salary REAL NOT NULL,
        FOREIGN KEY (management_id) REFERENCES managements(id)
      )
      `
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surname TEXT NOT NULL,
        name TEXT NOT NULL,
        middlename TEXT NOT NULL,
        birthdate DATE NOT NULL,
        gender TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        department_id INTEGER NOT NULL,
        management_id INTEGER NOT NULL,
        position_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (management_id) REFERENCES managements(id),
        FOREIGN KEY (position_id) REFERENCES positions(id)
      )
      `
    );

    db.run(
      `
      CREATE TRIGGER trigger_employees_updated_at AFTER UPDATE ON employees
      BEGIN
          UPDATE employees SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
      END
      `
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS histories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        department_id INTEGER NOT NULL,
        management_id INTEGER NOT NULL,
        position_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
        changed_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
      `
    );

    db.run(
      `
      CREATE TRIGGER trigger_histories_updated_at AFTER UPDATE ON histories
      BEGIN
          UPDATE histories SET changed_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
      END
    `
    );

    db.run(
      `
      INSERT INTO departments (name) VALUES
      ('Engineering'),
      ('Product'),
      ('Design'),
      ('Data'),
      ('Marketing'),
      ('Sales'),
      ('Human Resources')
      `
    );

    db.run(
      `
      INSERT INTO managements (department_id, name) VALUES
      (1, 'Engineering Management'),
      (2, 'Product Management'),
      (3, 'Design Management'),
      (4, 'Data Management'),
      (5, 'Marketing Management'),
      (6, 'Sales Management'),
      (7, 'Human Resources Management')
      `
    );

    db.run(
      `
      INSERT INTO positions (management_id, name, salary) VALUES
      (1, 'Software Engineer', 80000),
      (1, 'DevOps Engineer', 85000),
      (2, 'Product Manager', 90000),
      (3, 'UX Designer', 75000),
      (4, 'Data Scientist', 95000),
      (5, 'Marketing Specialist', 65000),
      (6, 'Sales Manager', 85000),
      (7, 'HR Coordinator', 60000)
      `
    );

    db.run(
      `
      INSERT INTO employees (surname, name, middlename, birthdate, gender, email, phone, address, department_id, management_id, position_id) VALUES
      ('Doe', 'John', 'A.', '1990-01-01', 'Male', 'john.doe@example.com', '123-456-7890', '123 Main St', 1, 1, 1),
      ('Smith', 'Jane', 'B.', '1985-05-15', 'Female', 'jane.smith@example.com', '098-765-4321', '456 Oak Ave', 2, 2, 2),
      ('Johnson', 'Emily', 'C.', '1992-12-10', 'Female', 'emily.johnson@example.com', '555-555-5555', '789 Pine Rd', 3, 3, 3),
      ('Brown', 'Michael', 'D.', '1988-08-20', 'Male', 'michael.brown@example.com', '444-444-4444', '321 Elm St', 4, 4, 4),
      ('Davis', 'Sarah', 'E.', '1995-03-25', 'Female', 'sarah.davis@example.com', '333-333-3333', '654 Maple Dr', 5, 5, 5),
      ('Wilson', 'David', 'F.', '1987-07-30', 'Male', 'david.wilson@example.com', '222-222-2222', '987 Cedar Ln', 6, 6, 6),
      ('Martinez', 'Laura', 'G.', '1990-11-05', 'Female', 'laura.martinez@example.com', '111-111-1111', '321 Oak St', 7, 7, 7),
      ('Anderson', 'Robert', 'H.', '1983-02-14', 'Male', 'robert.anderson@example.com', '101-202-3030', '12 Birch Way', 8, 8, 8),
      ('Taylor', 'Jessica', 'I.', '1991-09-09', 'Female', 'jessica.taylor@example.com', '202-303-4040', '45 Spruce St', 9, 9, 9),
      ('Thomas', 'Daniel', 'J.', '1994-06-18', 'Male', 'daniel.thomas@example.com', '303-404-5050', '78 Willow Rd', 10, 10, 10),
      ('Moore', 'Ashley', 'K.', '1989-04-22', 'Female', 'ashley.moore@example.com', '404-505-6060', '90 Ash Blvd', 1, 2, 3),
      ('Jackson', 'Christopher', 'L.', '1986-10-30', 'Male', 'chris.jackson@example.com', '505-606-7070', '101 Poplar Ave', 2, 3, 4),
      ('White', 'Michelle', 'M.', '1993-01-17', 'Female', 'michelle.white@example.com', '606-707-8080', '203 Cherry Ln', 3, 4, 5),
      ('Harris', 'Matthew', 'N.', '1984-12-03', 'Male', 'matthew.harris@example.com', '707-808-9090', '305 Walnut Dr', 4, 5, 6),
      ('Thompson', 'Amanda', 'O.', '1996-07-28', 'Female', 'amanda.thompson@example.com', '808-909-0101', '407 Magnolia St', 5, 6, 7),
      ('Garcia', 'Joshua', 'P.', '1982-03-11', 'Male', 'joshua.garcia@example.com', '909-010-1212', '509 Palm Rd', 6, 7, 8),
      ('Clark', 'Stephanie', 'Q.', '1990-08-06', 'Female', 'stephanie.clark@example.com', '010-121-2323', '611 Sycamore Way', 7, 8, 9),
      ('Lewis', 'Andrew', 'R.', '1987-05-24', 'Male', 'andrew.lewis@example.com', '121-232-3434', '713 Hickory Blvd', 8, 9, 10),
      ('Walker', 'Nicole', 'S.', '1995-11-19', 'Female', 'nicole.walker@example.com', '232-343-4545', '815 Cypress Ave', 9, 10, 1),
      ('Hall', 'Ryan', 'T.', '1988-09-02', 'Male', 'ryan.hall@example.com', '343-454-5656', '917 Redwood Ln', 10, 1, 2),
      ('Allen', 'Rebecca', 'U.', '1991-02-27', 'Female', 'rebecca.allen@example.com', '454-565-6767', '119 Fir St', 1, 2, 3),
      ('Young', 'Kevin', 'V.', '1985-06-13', 'Male', 'kevin.young@example.com', '565-676-7878', '221 Sequoia Dr', 2, 3, 4),
      ('King', 'Rachel', 'W.', '1993-10-21', 'Female', 'rachel.king@example.com', '676-787-8989', '323 Juniper Rd', 3, 4, 5),
      ('Wright', 'Brian', 'X.', '1986-04-08', 'Male', 'brian.wright@example.com', '787-898-9090', '425 Laurel Ave', 4, 5, 6),
      ('Scott', 'Samantha', 'Y.', '1994-12-15', 'Female', 'samantha.scott@example.com', '898-909-0101', '527 Dogwood Ln', 5, 6, 7),
      ('Torres', 'Justin', 'Z.', '1989-01-29', 'Male', 'justin.torres@example.com', '909-010-1313', '629 Magnolia Dr', 6, 7, 8),
      ('Nguyen', 'Elizabeth', 'A.', '1992-05-07', 'Female', 'elizabeth.nguyen@example.com', '010-131-2424', '731 Chestnut St', 7, 8, 9),
      ('Hill', 'Brandon', 'B.', '1983-08-23', 'Male', 'brandon.hill@example.com', '131-242-3535', '833 Beech Rd', 8, 9, 10),
      ('Flores', 'Megan', 'C.', '1996-03-04', 'Female', 'megan.flores@example.com', '242-353-4646', '935 Willow Ave', 9, 10, 1),
      ('Green', 'Eric', 'D.', '1987-11-12', 'Male', 'eric.green@example.com', '353-464-5757', '137 Aspen Blvd', 10, 1, 2),
      ('Adams', 'Katherine', 'E.', '1991-07-19', 'Female', 'katherine.adams@example.com', '464-575-6868', '239 Linden Ln', 1, 2, 3),
      ('Nelson', 'Tyler', 'F.', '1988-02-01', 'Male', 'tyler.nelson@example.com', '575-686-7979', '341 Holly St', 2, 3, 4),
      ('Baker', 'Victoria', 'G.', '1994-09-16', 'Female', 'victoria.baker@example.com', '686-797-8080', '443 Olive Dr', 3, 4, 5),
      ('Hall', 'Jonathan', 'H.', '1985-12-28', 'Male', 'jonathan.hall@example.com', '797-808-9191', '545 Cypress Rd', 4, 5, 6),
      ('Rivera', 'Christina', 'I.', '1990-06-10', 'Female', 'christina.rivera@example.com', '808-919-0202', '647 Cedar Ave', 5, 6, 7),
      ('Campbell', 'Patrick', 'J.', '1986-10-05', 'Male', 'patrick.campbell@example.com', '919-020-1313', '749 Birch Ln', 6, 7, 8),
      ('Mitchell', 'Vanessa', 'K.', '1993-04-17', 'Female', 'vanessa.mitchell@example.com', '020-131-2424', '851 Spruce Dr', 7, 8, 9),
      ('Carter', 'Alexander', 'L.', '1989-08-29', 'Male', 'alexander.carter@example.com', '131-242-3535', '953 Pine St', 8, 9, 10),
      ('Roberts', 'Diana', 'M.', '1995-01-11', 'Female', 'diana.roberts@example.com', '242-353-4646', '155 Oak Blvd', 9, 10, 1),
      ('Phillips', 'Nathan', 'N.', '1984-05-22', 'Male', 'nathan.phillips@example.com', '353-464-5757', '257 Elm Rd', 10, 1, 2),
      ('Evans', 'Olivia', 'O.', '1992-11-30', 'Female', 'olivia.evans@example.com', '464-575-6868', '359 Maple Ave', 1, 2, 3),
      ('Turner', 'Logan', 'P.', '1988-03-14', 'Male', 'logan.turner@example.com', '575-686-7979', '461 Ash Ln', 2, 3, 4),
      ('Parker', 'Brittany', 'Q.', '1996-09-08', 'Female', 'brittany.parker@example.com', '686-797-8080', '563 Poplar Dr', 3, 4, 5),
      ('Collins', 'Aaron', 'R.', '1983-01-26', 'Male', 'aaron.collins@example.com', '797-808-9191', '665 Walnut St', 4, 5, 6),
      ('Edwards', 'Hannah', 'S.', '1991-06-02', 'Female', 'hannah.edwards@example.com', '808-919-0202', '767 Cherry Rd', 5, 6, 7),
      ('Stewart', 'Tyler', 'T.', '1987-12-19', 'Male', 'tyler.stewart@example.com', '919-020-1313', '869 Magnolia Ave', 6, 7, 8),
      ('Morris', 'Sophia', 'U.', '1994-04-25', 'Female', 'sophia.morris@example.com', '020-131-2424', '971 Palm Ln', 7, 8, 9),
      ('Murphy', 'Zachary', 'V.', '1985-08-11', 'Male', 'zachary.murphy@example.com', '131-242-3535', '173 Sycamore Dr', 8, 9, 10),
      ('Cook', 'Lauren', 'W.', '1993-02-07', 'Female', 'lauren.cook@example.com', '242-353-4646', '275 Hickory St', 9, 10, 1),
      ('Rogers', 'Ethan', 'X.', '1989-10-23', 'Male', 'ethan.rogers@example.com', '353-464-5757', '377 Cypress Ave', 10, 1, 2),
      ('Morgan', 'Grace', 'Y.', '1990-05-30', 'Female', 'grace.morgan@example.com', '464-575-6868', '479 Redwood Rd', 1, 2, 3),
      ('Peterson', 'Austin', 'Z.', '1986-09-15', 'Male', 'austin.peterson@example.com', '575-686-7979', '581 Fir Ln', 2, 3, 4),
      ('Cooper', 'Chloe', 'A.', '1995-01-04', 'Female', 'chloe.cooper@example.com', '686-797-8080', '683 Sequoia Dr', 3, 4, 5),
      ('Reed', 'Jacob', 'B.', '1984-06-27', 'Male', 'jacob.reed@example.com', '797-808-9191', '785 Juniper St', 4, 5, 6),
      ('Bailey', 'Zoe', 'C.', '1992-11-13', 'Female', 'zoe.bailey@example.com', '808-919-0202', '887 Laurel Rd', 5, 6, 7),
      ('Bell', 'Caleb', 'D.', '1988-03-31', 'Male', 'caleb.bell@example.com', '919-020-1313', '989 Dogwood Ave', 6, 7, 8),
      ('Kelly', 'Lily', 'E.', '1996-07-08', 'Female', 'lily.kelly@example.com', '020-131-2424', '191 Magnolia Ln', 7, 8, 9),
      ('Howard', 'Isaac', 'F.', '1983-12-20', 'Male', 'isaac.howard@example.com', '131-242-3535', '293 Chestnut Dr', 8, 9, 10),
      ('Ward', 'Aria', 'G.', '1991-04-02', 'Female', 'aria.ward@example.com', '242-353-4646', '395 Beech St', 9, 10, 1),
      ('Cox', 'Owen', 'H.', '1987-08-16', 'Male', 'owen.cox@example.com', '353-464-5757', '497 Aspen Ave', 10, 1, 2),
      ('Diaz', 'Nora', 'I.', '1994-12-09', 'Female', 'nora.diaz@example.com', '464-575-6868', '599 Linden Rd', 1, 2, 3),
      ('Richardson', 'Liam', 'J.', '1985-02-25', 'Male', 'liam.richardson@example.com', '575-686-7979', '701 Holly Ln', 2, 3, 4),
      ('Wood', 'Ella', 'K.', '1993-06-14', 'Female', 'ella.wood@example.com', '686-797-8080', '803 Olive Dr', 3, 4, 5),
      ('Watson', 'Mason', 'L.', '1989-10-28', 'Male', 'mason.watson@example.com', '797-808-9191', '905 Cypress St', 4, 5, 6),
      ('Brooks', 'Avery', 'M.', '1990-03-06', 'Female', 'avery.brooks@example.com', '808-919-0202', '107 Cedar Rd', 5, 6, 7),
      ('Bennett', 'Lucas', 'N.', '1986-07-19', 'Male', 'lucas.bennett@example.com', '919-020-1313', '209 Birch Ave', 6, 7, 8),
      ('Gray', 'Scarlett', 'O.', '1995-11-01', 'Female', 'scarlett.gray@example.com', '020-131-2424', '311 Spruce Ln', 7, 8, 9),
      ('James', 'Elijah', 'P.', '1984-05-12', 'Male', 'elijah.james@example.com', '131-242-3535', '413 Pine Dr', 8, 9, 10),
      ('Reyes', 'Stella', 'Q.', '1992-09-24', 'Female', 'stella.reyes@example.com', '242-353-4646', '515 Oak St', 9, 10, 1),
      ('Hughes', 'Jackson', 'R.', '1988-01-08', 'Male', 'jackson.hughes@example.com', '353-464-5757', '617 Elm Rd', 10, 1, 2),
      ('Price', 'Madison', 'S.', '1996-05-21', 'Female', 'madison.price@example.com', '464-575-6868', '719 Maple Ave', 1, 2, 3),
      ('Sanders', 'Sebastian', 'T.', '1983-09-04', 'Male', 'sebastian.sanders@example.com', '575-686-7979', '821 Ash Ln', 2, 3, 4),
      ('Barnes', 'Aubrey', 'U.', '1991-01-27', 'Female', 'aubrey.barnes@example.com', '686-797-8080', '923 Poplar Dr', 3, 4, 5),
      ('Ross', 'Carter', 'V.', '1987-06-09', 'Male', 'carter.ross@example.com', '797-808-9191', '125 Walnut St', 4, 5, 6),
      ('Henderson', 'Camila', 'W.', '1994-10-17', 'Female', 'camila.henderson@example.com', '808-919-0202', '227 Cherry Rd', 5, 6, 7),
      ('Coleman', 'Wyatt', 'X.', '1985-02-23', 'Male', 'wyatt.coleman@example.com', '919-020-1313', '329 Magnolia Ave', 6, 7, 8),
      ('Jenkins', 'Penelope', 'Y.', '1993-08-05', 'Female', 'penelope.jenkins@example.com', '020-131-2424', '431 Palm Ln', 7, 8, 9),
      ('Perry', 'Julian', 'Z.', '1989-12-11', 'Male', 'julian.perry@example.com', '131-242-3535', '533 Sycamore Dr', 8, 9, 10),
      ('Powell', 'Layla', 'A.', '1990-04-18', 'Female', 'layla.powell@example.com', '242-353-4646', '635 Hickory St', 9, 10, 1),
      ('Long', 'Grayson', 'B.', '1986-08-26', 'Male', 'grayson.long@example.com', '353-464-5757', '737 Cypress Rd', 10, 1, 2),
      ('Patterson', 'Riley', 'C.', '1995-12-03', 'Female', 'riley.patterson@example.com', '464-575-6868', '839 Redwood Ave', 1, 2, 3),
      ('Hughes', 'Levi', 'D.', '1984-04-15', 'Male', 'levi.hughes@example.com', '575-686-7979', '941 Fir Ln', 2, 3, 4),
      ('Flores', 'Natalie', 'E.', '1992-10-27', 'Female', 'natalie.flores@example.com', '686-797-8080', '143 Sequoia Dr', 3, 4, 5),
      ('Butler', 'Hunter', 'F.', '1988-02-09', 'Male', 'hunter.butler@example.com', '797-808-9191', '245 Juniper St', 4, 5, 6),
      ('Simmons', 'Leah', 'G.', '1996-06-22', 'Female', 'leah.simmons@example.com', '808-919-0202', '347 Laurel Rd', 5, 6, 7),
      ('Foster', 'Connor', 'H.', '1983-10-30', 'Male', 'connor.foster@example.com', '919-020-1313', '449 Dogwood Ave', 6, 7, 8),
      ('Gonzales', 'Audrey', 'I.', '1991-02-12', 'Female', 'audrey.gonzales@example.com', '020-131-2424', '551 Magnolia Ln', 7, 8, 9),
      ('Bryant', 'Eli', 'J.', '1987-07-24', 'Male', 'eli.bryant@example.com', '131-242-3535', '653 Chestnut Dr', 8, 9, 10),
      ('Alexander', 'Claire', 'K.', '1994-11-06', 'Female', 'claire.alexander@example.com', '242-353-4646', '755 Beech St', 9, 10, 1),
      ('Russell', 'Colton', 'L.', '1985-03-19', 'Male', 'colton.russell@example.com', '353-464-5757', '857 Aspen Ave', 10, 1, 2),
      ('Griffin', 'Skylar', 'M.', '1993-09-01', 'Female', 'skylar.griffin@example.com', '464-575-6868', '959 Linden Rd', 1, 2, 3),
      ('Diaz', 'Diego', 'N.', '1989-01-14', 'Male', 'diego.diaz@example.com', '575-686-7979', '161 Holly Ln', 2, 3, 4),
      ('Hayes', 'Violet', 'O.', '1990-05-26', 'Female', 'violet.hayes@example.com', '686-797-8080', '263 Olive Dr', 3, 4, 5),
      ('Myers', 'Jaxon', 'P.', '1986-09-08', 'Male', 'jaxon.myers@example.com', '797-808-9191', '365 Cypress St', 4, 5, 6),
      ('Ford', 'Lillian', 'Q.', '1995-01-20', 'Female', 'lillian.ford@example.com', '808-919-0202', '467 Cedar Rd', 5, 6, 7),
      ('Hamilton', 'Asher', 'R.', '1984-05-03', 'Male', 'asher.hamilton@example.com', '919-020-1313', '569 Birch Ave', 6, 7, 8),
      ('Graham', 'Aurora', 'S.', '1992-09-15', 'Female', 'aurora.graham@example.com', '020-131-2424', '671 Spruce Ln', 7, 8, 9),
      ('Sullivan', 'Miles', 'T.', '1988-01-28', 'Male', 'miles.sullivan@example.com', '131-242-3535', '773 Pine Dr', 8, 9, 10),
      ('Wallace', 'Sadie', 'U.', '1996-05-10', 'Female', 'sadie.wallace@example.com', '242-353-4646', '875 Oak St', 9, 10, 1);
    `
    );
  });
}