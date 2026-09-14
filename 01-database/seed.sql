-- ==============================================================================
-- CIVICAI DATABASE SEED DATA (SAMPLE INDIAN CITIES & CIVIC ISSUES)
-- ==============================================================================

-- 1. SEED SAMPLE ORGANIZATIONS
INSERT INTO public.organizations (id, name, type, city, state) VALUES
('b1000000-0000-0000-0000-000000000001', 'MCD Central Civic Zone', 'Municipal Zone', 'Delhi', 'Delhi'),
('b1000000-0000-0000-0000-000000000002', 'BBMP Mahadevapura Division', 'Municipal Zone', 'Bengaluru', 'Karnataka'),
('b1000000-0000-0000-0000-000000000003', 'BMC K-West Ward Office', 'Municipal Zone', 'Mumbai', 'Maharashtra'),
('b1000000-0000-0000-0000-000000000004', 'BRCM Campus Facility Management', 'College', 'Bhiwani', 'Haryana'),
('b1000000-0000-0000-0000-000000000005', 'DLF Phase 5 Residents Welfare Association', 'Housing Society', 'Gurugram', 'Haryana'),
('b1000000-0000-0000-0000-000000000006', 'Hinjewadi Tech Park Infrastructure Unit', 'Office', 'Pune', 'Maharashtra')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED SAMPLE REALISTIC CIVIC ISSUES
INSERT INTO public.issues (
    id, image_url, issue_type, category, description,
    location_text, city, state, latitude, longitude,
    severity, priority_score, priority_level, ai_confidence,
    ai_explanation, status, assigned_to, created_at, updated_at
) VALUES
(
    'CA-2026-00101',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'Large Deep Pothole',
    'Road Infrastructure',
    'Hazardous deep crater formed on inner circle arterial curve causing severe vehicle deceleration and two-wheeler skid hazards.',
    'Inner Circle, Near Block B, Connaught Place',
    'Delhi',
    'Delhi',
    28.6315,
    77.2167,
    'Critical',
    93,
    'P1',
    96,
    'High vehicular density road. Depth exceeds 15cm with exposed aggregate. High risk of 2-wheeler accidents.',
    'In Progress',
    'Inspector Rajesh Verma (PWD Central)',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '4 hours'
),
(
    'CA-2026-00102',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    'Overflowing Community Garbage Dump',
    'Solid Waste Management',
    'Secondary waste bin overflowing onto pedestrian footpath for over 48 hours, blocking pedestrian passage and emanating strong odor.',
    'SV Road, Near Station Flyover, Andheri West',
    'Mumbai',
    'Maharashtra',
    19.1197,
    72.8468,
    'High',
    84,
    'P2',
    92,
    'Bio-waste spillover identified extending 3 meters along pedestrian walking zone. Sanitation and health risk.',
    'Assigned',
    'K-West Sanitation Ward Unit',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '2 hours'
),
(
    'CA-2026-00103',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    'Major Water Main Pipe Burst',
    'Water & Drainage',
    'Drinking water supply pipe burst leaking clean potable water continuously onto roadway, submerging the service lane.',
    '80 Feet Road, 4th Block, Koramangala',
    'Bengaluru',
    'Karnataka',
    12.9352,
    77.6245,
    'Critical',
    91,
    'P1',
    94,
    'High-pressure drinking water line leakage. Potable resource wastage estimated at 200L/min and roadway erosion underway.',
    'Verified',
    'BWSSB Emergency Wing',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '1 hour'
),
(
    'CA-2026-00104',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
    'Broken Streetlight Pole & Hanging Wires',
    'Lighting & Electricity',
    'Street lighting pole damaged after vehicle hit, exposing active insulation and leaving junction in darkness.',
    'Near Metro Gate 2, Sector 18',
    'Noida',
    'Uttar Pradesh',
    28.5708,
    77.3261,
    'High',
    79,
    'P2',
    89,
    'Exposed wiring detected at pedestrian height with unlit evening thoroughfare. Electrical hazard.',
    'Reported',
    NULL,
    NOW() - INTERVAL '18 hours',
    NOW() - INTERVAL '18 hours'
),
(
    'CA-2026-00105',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    'Fallen Tree Branch Blocking Lane',
    'Environment & Greenery',
    'Large Gulmohar tree limb severed during evening thunderstorm, blocking left traffic lane and cycling track.',
    'Phase 1 Main Boulevard, Hinjewadi',
    'Pune',
    'Maharashtra',
    18.5913,
    73.7389,
    'Medium',
    68,
    'P3',
    95,
    'Physical obstruction on secondary vehicular lane. No live electric wires entangled.',
    'Resolved',
    'MIDC Horticulture Division',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '1 day'
),
(
    'CA-2026-00106',
    'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    'Damaged Public Footpath Pavers',
    'Public Infrastructure',
    'Broken concrete interlocking tiles and missing utility cover creating a 2-foot foot-trap on elderly pedestrian walkway.',
    'Near Gaurav Tower, Malviya Nagar',
    'Jaipur',
    'Rajasthan',
    26.8528,
    75.8118,
    'Low',
    42,
    'P4',
    87,
    'Localized pavement damage without high-speed vehicular impact. Tripping hazard for pedestrians.',
    'Reported',
    NULL,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED RESOLUTION EVIDENCE FOR ISSUE CA-2026-00105
INSERT INTO public.resolutions (
    issue_id, resolution_note, after_image_url, created_at
) VALUES (
    'CA-2026-00105',
    'Fallen Gulmohar branches chopped and cleared by MIDC emergency tree authority. Lane swept and reopened to traffic within 4 hours of assignment.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    NOW() - INTERVAL '1 day'
)
ON CONFLICT DO NOTHING;
