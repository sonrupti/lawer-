-- ====================================================================
-- LAWYER DATABASE SEED DATA
-- This script populates 'lawyers' and 'cases' tables with realistic mock data
-- representing advocates in the Odisha High Court.
-- Paste and run this script in the Supabase SQL Editor.
-- ====================================================================

-- Clear existing data (ensures clean seed)
TRUNCATE TABLE cases RESTART IDENTITY CASCADE;
TRUNCATE TABLE lawyers RESTART IDENTITY CASCADE;

-- 1. Insert lawyers data
INSERT INTO lawyers (name, bar_number, practice_area, experience, phone, email, city, ai_insight, avg_disposal_time)
VALUES 
(
  'Adv. Abhinav Mohanty', 
  'O/874/2006', 
  'Property, Civil, Constitutional', 
  18, 
  '+91 94371 23456', 
  'abhinav.mohanty@orissabar.in', 
  'Cuttack', 
  'Advocate Mohanty primarily appears in property disputes and civil appeals before the single and division benches of the Odisha High Court. Over the past 5 years, his practice has shifted toward land acquisition and commercial property litigations. Known for rapid resolutions and methodical approach to land revenue records.', 
  7.2
),
(
  'Adv. Priyadarshini Patnaik', 
  'O/312/2010', 
  'Criminal, Constitutional, Service', 
  14, 
  '+91 99370 98765', 
  'p.patnaik@orissabar.in', 
  'Cuttack', 
  'Priyadarshini Patnaik specializes in criminal defense, bail applications, and service matters (government employment disputes). She regularly appears before division benches on constitutional challenges. She maintains a high rate of successful bail resolutions and is noted for aggressive advocacy in criminal appeals.', 
  4.5
),
(
  'Adv. Manoranjan Mishra', 
  'O/512/1997', 
  'Constitutional, GST, Corporate', 
  27, 
  '+91 94370 11223', 
  'm.mishra@orissabar.in', 
  'Bhubaneswar', 
  'Designated Senior Advocate Manoranjan Mishra represents large corporate clients, mining corporations, and tax bodies in GST disputes and constitutional challenges. He frequently appears before division benches. Over 80% of his matters involve complex statutory interpretations and tax exemption claims.', 
  9.8
),
(
  'Adv. Rajesh Nayak', 
  'O/642/2015', 
  'Criminal, Property', 
  9, 
  '+91 82490 55443', 
  'rajesh.nayak@orissabar.in', 
  'Cuttack', 
  'Advocate Rajesh Nayak represents litigants in property title cases and criminal trials. Over the last 3 years, his caseload shows a focus on land encroachment suits, family property divisions, and anticipatory bail petitions before the Single Bench of the High Court.', 
  5.1
),
(
  'Adv. Sucharita Das', 
  'O/120/2012', 
  'Service, Civil, Corporate', 
  12, 
  '+91 70081 66778', 
  'sucharita.das@orissabar.in', 
  'Bhubaneswar', 
  'Sucharita Das primarily represents employees and university faculty in service tenure, disciplinary actions, and pension disputes. Her practice also includes contract breaches and corporate compliance issues in state public sector undertakings.', 
  6.0
);

-- 2. Insert cases data
-- Connect cases to lawyers by selecting their IDs
INSERT INTO cases (lawyer_id, case_number, court, case_type, filing_date, status, outcome, judgment)
VALUES
-- Cases for Adv. Abhinav Mohanty (ID 1)
(1, 'WP(C)/1402/2023', 'Odisha High Court', 'Writ Petition', '2023-01-15', 'Disposed', 'Allowed', 'The petitioner''s title over the disputed land is confirmed. Opposing party''s eviction order set aside due to lack of proper administrative notice.'),
(1, 'SA/210/2023', 'Odisha High Court', 'Civil Appeal', '2023-05-10', 'Disposed', 'Dismissed', 'Appeal dismissed. No substantial question of law arose. The lower court''s partition decree remains undisturbed.'),
(1, 'WP(C)/8450/2024', 'Odisha High Court', 'Writ Petition', '2024-02-18', 'Disposed', 'Partly Allowed', 'Compensation for land acquisition enhanced by 15% with 6% interest per annum. Claim for employment under rehabilitation scheme rejected.'),
(1, 'WP(C)/22045/2024', 'Odisha High Court', 'Writ Petition', '2024-08-22', 'Disposed', 'Allowed', 'State authority directed to issue possession certificate and layout clearance for the residential plot within 30 days.'),
(1, 'WP(C)/33012/2025', 'Odisha High Court', 'Writ Petition', '2025-01-20', 'Disposed', 'Withdrawn', 'Writ petition withdrawn with liberty to file fresh representation before the District Collector within 15 days.'),
(1, 'SA/45/2025', 'Odisha High Court', 'Civil Appeal', '2025-04-05', 'Disposed', 'Allowed', 'Civil revision petition allowed. Executing court directed to re-evaluate the boundaries as per Commissioner''s report.'),
(1, 'WP(C)/38902/2025', 'Odisha High Court', 'Writ Petition', '2025-10-12', 'Pending', 'Pending', NULL),

-- Cases for Adv. Priyadarshini Patnaik (ID 2)
(2, 'CRLA/84/2024', 'Odisha High Court', 'Criminal Appeal', '2024-01-10', 'Disposed', 'Allowed', 'Acquittal ordered. Lower court conviction under Sec 379 IPC set aside due to critical gaps in the prosecution''s chain of evidence.'),
(2, 'BLAPL/4590/2024', 'Odisha High Court', 'Bail Application', '2024-06-15', 'Disposed', 'Allowed', 'Regular bail granted on furnishing bond of Rs 50,000 with two local sureties. Directed to cooperate with the investigating officer.'),
(2, 'WP(C)/11025/2023', 'Odisha High Court', 'Writ Petition', '2023-11-20', 'Disposed', 'Allowed', 'Order of termination quashed. Petitioner (government school teacher) reinstated with 50% back wages and continuity of service.'),
(2, 'CRLA/302/2024', 'Odisha High Court', 'Criminal Appeal', '2024-03-05', 'Disposed', 'Dismissed', 'Appeal dismissed. Conviction and sentence of 5 years rigorous imprisonment under Sec 326 IPC upheld.'),
(2, 'BLAPL/1204/2025', 'Odisha High Court', 'Bail Application', '2025-05-12', 'Disposed', 'Allowed', 'Anticipatory bail granted in connection with allegations under Sec 420 IPC, subject to reporting to the police station weekly.'),
(2, 'WP(C)/40125/2025', 'Odisha High Court', 'Writ Petition', '2025-09-01', 'Pending', 'Pending', NULL),

-- Cases for Adv. Manoranjan Mishra (ID 3)
(3, 'WP(C)/6780/2023', 'Odisha High Court', 'Writ Petition', '2023-04-12', 'Disposed', 'Allowed', 'Tax demand order issued by the GST Commissioner quashed as it violated principles of natural justice and failed to consider audit replies.'),
(3, 'COA/12/2023', 'Odisha High Court', 'Civil Appeal', '2023-09-05', 'Disposed', 'Partly Allowed', 'Resolution plan approved with modifications. Minority creditors allowed to claim assets value proportion in priority.'),
(3, 'WP(C)/1980/2024', 'Odisha High Court', 'Writ Petition', '2024-01-15', 'Disposed', 'Dismissed', 'GST exemption claim rejected. The petitioner failed to demonstrate compliance with registration clauses under Section 12AA.'),
(3, 'WP(C)/14500/2024', 'Odisha High Court', 'Writ Petition', '2024-05-30', 'Disposed', 'Transferred', 'Tax petition transferred to the National Company Law Appellate Tribunal (NCLAT) for statutory resolution.'),
(3, 'WP(C)/4890/2025', 'Odisha High Court', 'Writ Petition', '2025-02-15', 'Disposed', 'Allowed', 'Director disqualification order set aside due to lack of administrative notice by the Registrar of Companies (RoC).'),
(3, 'WP(C)/32014/2025', 'Odisha High Court', 'Writ Petition', '2025-08-20', 'Pending', 'Pending', NULL),

-- Cases for Adv. Rajesh Nayak (ID 4)
(4, 'SA/180/2023', 'Odisha High Court', 'Civil Appeal', '2023-08-11', 'Disposed', 'Allowed', 'Injunction granted. Encroachers ordered to remove illegal constructions on the suit plot within 60 days.'),
(4, 'CRLA/420/2024', 'Odisha High Court', 'Criminal Appeal', '2024-04-02', 'Disposed', 'Dismissed', 'Appeal dismissed. Conviction under Sec 307 IPC (Attempt to Murder) upheld based on credible eyewitness testimony.'),
(4, 'BLAPL/8904/2024', 'Odisha High Court', 'Bail Application', '2024-10-09', 'Disposed', 'Allowed', 'Bail allowed. The petitioner had been in custody for 6 months and the state had failed to file the charge sheet within the time limit.'),
(4, 'SA/12/2025', 'Odisha High Court', 'Civil Appeal', '2025-01-10', 'Disposed', 'Withdrawn', 'Partition suit withdrawn by the plaintiff following an out-of-court family settlement partition deed execution.'),
(4, 'SA/198/2025', 'Odisha High Court', 'Civil Appeal', '2025-07-15', 'Pending', 'Pending', NULL),

-- Cases for Adv. Sucharita Das (ID 5)
(5, 'WP(C)/5490/2023', 'Odisha High Court', 'Writ Petition', '2023-03-20', 'Disposed', 'Allowed', 'Petitioner declared eligible for promotion from the date the vacancy arose. Promotion committee directed to implement within 8 weeks.'),
(5, 'COA/45/2023', 'Odisha High Court', 'Civil Appeal', '2023-10-05', 'Disposed', 'Dismissed', 'Claim for damages due to contractual delay dismissed. Plaintiff failed to prove that the delay caused direct financial losses.'),
(5, 'WP(C)/16200/2024', 'Odisha High Court', 'Writ Petition', '2024-05-18', 'Disposed', 'Allowed', 'State department directed to disburse all pending gratuity and retirement pension arrears to the teacher in 4 equal monthly installments.'),
(5, 'COA/8/2025', 'Odisha High Court', 'Civil Appeal', '2025-01-08', 'Disposed', 'Partly Allowed', 'Request for specific performance of contract denied, but defendant ordered to refund advance earnest money of Rs 2 Lakh with 8% interest.'),
(5, 'WP(C)/25012/2025', 'Odisha High Court', 'Writ Petition', '2025-06-25', 'Pending', 'Pending', NULL);
