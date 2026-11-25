
Niche FixMate-er **shob page-er ekta clean "Mind Map" (Route + Main Kaj)** dewa holo, jate ek nojore sob mone rakhte paren:

---

### 1. Public & Auth Pages (Sobai Dekhte Pare)

| Page / Route | Mathay Rakhar Moto Main Kaj |
| --- | --- |
| **`/`** (Home) | Hero banner + search/CTA, 6 ta latest approved & available service cards, 4-step "How FixMate Works", ar Popular Categories (`/services?category=...` click korle oi category-te filter hoye jabe). |
| **`/services`** (Browse Services) | Shudhu `approvalStatus: 'approved'` ebong `isAvailable: true` services grid-e dekhabe. Search, category/mode filter, ar price/newest sort server-side theke kaj korbe (reload dileo thakbe). |
| **`/services/[id]`** (Service Details) | Service-er full details + technician summary. **Customer** hole **Request Repair** form khulbe; **Technician/Admin** hole disabled/hidden thakbe; **Logged-out** hole `/sign-in`-e niye jabe. |
| **`/about`** (How It Works / About) | Platform-er overview, workflow, ar trust info. |
| **`/sign-up`** & **`/sign-in`** | Sign up-e **Customer** ba **Technician** role select kora jay (**Admin** na), password validation thake. Login korle target route ba nijer role-er dashboard-e redirect hoy. |
| **`/payment/success`** & **`/payment/cancel`** | Stripe payment-er por session verify kore `payments` collection-e save + booking `paid` korbe (`/success`), ba cancel korle database change na kore `/cancel` dekhabe. |

---

### 2. Customer Dashboard Pages (`role: 'customer'`)

| Page / Route | Mathay Rakhar Moto Main Kaj |
| --- | --- |
| **`/dashboard/customer`** | Overview stats cards: **Total Requests**, **Active Jobs**, **Completed Jobs**. |
| **`/dashboard/customer/bookings`** | Nijer sob bookings-er status (`Requested` → `Accepted` → `In Progress` → `Completed` / `Rejected` / `Cancelled`) ar payment (`Unpaid` / `Paid`) dekha. Shudhu `requested` thakle **Cancel** button, ar `completed` + `unpaid` thakle **Pay Now** button. |
| **`/dashboard/customer/payments`** | Nijer dewa sob Stripe payments-er history (service title, technician, amount, transaction ID, date). |

---

### 3. Technician Dashboard Pages (`role: 'technician'`)

| Page / Route | Mathay Rakhar Moto Main Kaj |
| --- | --- |
| **`/dashboard/technician`** | Overview stats cards: **Total Services**, **Approved Services**, **Pending Requests**. |
| **`/dashboard/technician/add-service`** | Notun service add korar form (ImgBB image upload সহ). Save hole `approvalStatus: 'pending'` thakbe (Admin approve na kora porjonto `/services`-e asbe na). |
| **`/dashboard/technician/my-services`** | Nijer services list + **Edit** (edit korle abar `pending` hoye jay), **Delete** (confirmation modal), ar **Availability toggle** (`isAvailable` off korle public page theke sore jay). |
| **`/dashboard/technician/requests`** | Nijer service-er incoming requests + status filter. Pipeline step-by-step: `requested` → Accept/Reject → `accepted` → Start Work (`in-progress`) → `in-progress` → Mark Completed (`finalAmount` set kore). |

---

### 4. Admin Dashboard Pages (`role: 'admin'`)

| Page / Route | Mathay Rakhar Moto Main Kaj |
| --- | --- |
| **`/dashboard/admin`** | Overview stats cards: **Total Users**, **Total Technicians**, **Pending Services**. |
| **`/dashboard/admin/users`** | Sob users list + role change (`customer` / `technician` / `admin`), tobe admin **nijer role change korte parbe na**. |
| **`/dashboard/admin/services`** | Sob technician-der services + **Approve** (`approved`) / **Reject** (`rejected`) action (pending gula age/sahoj-e pawa jabe). |
| **`/dashboard/admin/bookings`** | Platform-er sob bookings (read-only) + status filter. |
| **`/dashboard/admin/transactions`** | Total revenue + sob `payments` records (customer, technician, service, amount, transaction ID, date). |

---

### 5. Shared Private Page (Sob 3 Role-er Jonno)

| Page / Route | Mathay Rakhar Moto Main Kaj |
| --- | --- |
| **`/dashboard/profile`** | Name, Phone, Area, Bio, ar Profile Photo (ImgBB) update kora jay (`Email` & `Role` read-only). Save korlei **logout na korei** Navbar ar Top bar-e new name/photo update hote hobe. |

---

### Mathay Rakhar 3ta Golden Rule (Testing-er Somoy)

1. **Route Protection & Reload:** Je kono `/dashboard/...` route-e reload dile jeno user login page-e kick na khay, ar onno role-er route-e gele `403`/redirect/forbidden kaj kore.
2. **Status & Payment Gate:** Job `completed` + `unpaid` na hole Pay Now thakbe na; status pipeline skip kora jabe na; same service-e active booking thakle duplicate request server block korbe.
3. **Approval Gate:** Notun service ba edited service `pending` thake — Admin `approved` korle ebong `isAvailable: true` thaklei public `/services`-e dekha jay.

Ei page map-ta mathay rekhe ekhon chaile apni **Customer**, **Technician**, ba **Admin** — je kono ekta role diye testing shuru korte paren. Kon role-ta age check korben?



অবশ্যই, একদম সহজ বাংলায় দিচ্ছি — কোন পেজে কী কাজ হয় সেটার মাইন্ড ম্যাপ আর আপনার কাজ/টেস্টিং করার **First Step → Second Step → Third Step → End** কীভাবে করবেন, সেটার পরিষ্কার ধাপ।

---

### ১. কোন পেজে কী কাজ হয় (সহজ বাংলায় Mind Map)

#### Public ও Auth পেজ (সবাই দেখতে পারে)

* **`/` (Home):** হিরো ব্যানার, লেটেস্ট ৬টি অ্যাপ্রুভড ও অ্যাভেইলেবল সার্ভিস কার্ড, ৪ ধাপের "How FixMate Works", আর ক্যাটাগরি কার্ড (ক্লিক করলে `/services?category=...` এ গিয়ে ওই ক্যাটাগরি ফিল্টার হয়)।
* **`/services` (Browse Services):** শুধু `approvalStatus: 'approved'` এবং `isAvailable: true` সার্ভিসগুলো দেখায়। সার্চ, ফিল্টার ও সর্ট সার্ভার (MongoDB) থেকে কাজ করে এবং রিলোড দিলেও থাকে।
* **`/services/[id]` (Service Details):** সার্ভিসের বিস্তারিত ও টেকনিশিয়ানের তথ্য দেখায়। **Customer** হলে **Request Repair** ফর্ম খোলে; **Technician/Admin** হলে বাটন ডিজেবল/লুকানো থাকে; লগ-আউট থাকলে `/sign-in` এ নেয়।
* **`/about`:** প্ল্যাটফর্মের কাজের নিয়ম ও তথ্য।
* **`/sign-up` ও `/sign-in`:** সাইন আপে **Customer** বা **Technician** রোল নেওয়া যায় (**Admin** না), পাসওয়ার্ড ভ্যালিডেশন থাকে। লগইনে সঠিক ড্যাশবোর্ডে নিয়ে যায়।
* **`/payment/success` ও `/payment/cancel`:** Stripe পেমেন্ট সফল হলে সেশন ভেরিফাই করে `payments` কালেকশনে সেভ ও বুকিং `paid` করে (`/success`); ক্যান্সেল করলে ডাটাবেস বদলায় না (`/cancel`)।

#### Customer ড্যাশবোর্ড (`role: 'customer'`)

* **`/dashboard/customer`:** Total Requests, Active Jobs, Completed Jobs কার্ড।
* **`/dashboard/customer/bookings`:** নিজের সব বুকিংয়ের স্ট্যাটাস ও পেমেন্ট স্ট্যাটাস দেখায়। স্ট্যাটাস `requested` থাকলে **Cancel** বাটন, আর `completed` + `unpaid` থাকলে **Pay Now** বাটন থাকে।
* **`/dashboard/customer/payments`:** নিজের করা সব পেমেন্টের হিস্ট্রি (সার্ভিস, টেকনিশিয়ান, অ্যামাউন্ট, ট্রানজেকশন আইডি, তারিখ)।

#### Technician ড্যাশবোর্ড (`role: 'technician'`)

* **`/dashboard/technician`:** Total Services, Approved Services, Pending Requests কার্ড।
* **`/dashboard/technician/add-service`:** নতুন সার্ভিস যোগ করার ফর্ম (ImgBB ইমেজ আপলোডসহ)। সেভ হলে `approvalStatus: 'pending'` থাকে।
* **`/dashboard/technician/my-services`:** নিজের সার্ভিসের লিস্ট, **Edit** (এডিট করলে আবার `pending` হয়), **Delete** (কনফার্মেশন মডাল), ও **Availability toggle** (`isAvailable` অফ করলে পাবলিক পেজে দেখায় না)।
* **`/dashboard/technician/requests`:** নিজের সার্ভিসের রিকোয়েস্ট ও স্ট্যাটাস ফিল্টার। ধাপে ধাপে কাজ এগোয়: `requested` → Accept/Reject → `accepted` → Start Work (`in-progress`) → `in-progress` → Mark Completed (`finalAmount` বসিয়ে)।

#### Admin ড্যাশবোর্ড (`role: 'admin'`)

* **`/dashboard/admin`:** Total Users, Total Technicians, Pending Services কার্ড।
* **`/dashboard/admin/users`:** সব ইউজার ও রোল পরিবর্তন (`customer` / `technician` / `admin`), তবে অ্যাডমিন **নিজের রোল বদলাতে পারবে না**।
* **`/dashboard/admin/services`:** সব সার্ভিস দেখা এবং **Approve** বা **Reject** করা (পেন্ডিংগুলো সহজে পাওয়া যায়)।
* **`/dashboard/admin/bookings`:** প্ল্যাটফর্মের সব বুকিং (রিড-অনলি) ও স্ট্যাটাস ফিল্টার।
* **`/dashboard/admin/transactions`:** মোট রেভিনিউ ও সব পেমেন্টের তালিকা।

#### সবার জন্য Shared পেজ

* **`/dashboard/profile`:** Name, Phone, Area, Bio ও Profile Photo (ImgBB) আপডেট (`Email` ও `Role` রিড-অনলি)। সেভ করলে **লগআউট ছাড়াই** Navbar ও Top bar-এ নতুন নাম/ছবি আপডেট হতে হবে।

---

### ২. আপনার কাজ করার First → Second → Third → End ধাপ

#### First Step: শুরু করার প্রস্তুতি (Setup & Auth Check)

1. `.env` ও `.env.local` এ MongoDB, BetterAuth, JWT, ImgBB, Stripe সব ঠিক আছে কি না দেখুন।
2. ডাটাবেস/সিড দিয়ে অন্তত ১টি **Admin** অ্যাকাউন্ট তৈরি করুন; Sign Up থেকে **Customer** ও **Technician** অ্যাকাউন্ট খুলুন; প্রয়োজনমতো সিড ডাটা রাখুন।
3. যেকোনো `/dashboard/...` রাউটে গিয়ে **Page Reload** দিন — ইউজার যেন লগইন পেজে ছিটকে না পড়ে এবং CORS / 404 / 504 না আসে।

#### Second Step: রোল অনুযায়ী ফ্লো চেক (Customer → Technician → Admin)

1. **Customer ফ্লো:** `/services` থেকে সার্ভিস দেখে `/services/[id]` এ গিয়ে Request করুন → `/dashboard/customer/bookings` এ গিয়ে `requested` অবস্থায় Cancel টেস্ট করুন (আরেকটা রিকোয়েস্টে `completed` পর্যন্ত নিয়ে Pay Now দিয়ে Stripe টেস্ট কার্ডে পেমেন্ট করে `/dashboard/customer/payments` দেখুন)।
2. **Technician ফ্লো:** `/dashboard/technician/add-service` এ সার্ভিস অ্যাড করুন (`pending` হিসেবে সেভ হয় কি না দেখুন) → `/dashboard/technician/my-services` এ Edit (আবার `pending` হয় কি না), Toggle, Delete দেখুন → `/dashboard/technician/requests` এ ধাপে ধাপে `accepted` → `in-progress` → `completed` (`finalAmount` দিয়ে) করুন।
3. **Admin ফ্লো:** `/dashboard/admin/users` এ রোল বদলান (নিজের রোল যেন না বদলায়) → `/dashboard/admin/services` এ টেকনিশিয়ানের `pending` সার্ভিস Approve করুন (এবার `/services` এ দেখা যাবে) → `/dashboard/admin/bookings` ও `/dashboard/admin/transactions` চেক করুন।

#### Third Step: শেয়ার্ড প্রোফাইল ও এজ কেস (Edge Cases)

1. `/dashboard/profile` এ প্রোফাইল আপডেট করে লগআউট না করেই Navbar ও Dashboard Top bar-এ বদল দেখুন।
2. ডুপ্লিকেট অ্যাক্টিভ বুকিং ব্লক হচ্ছে কি না, স্ট্যাটাস স্কিপ করলে সার্ভার আটকাচ্ছে কি না, আর অন্য রোলের ড্যাশবোর্ডে গেলে `403`/রিডাইরেক্ট কাজ করছে কি না যাচাই করুন।

#### End: সাবমিশনের আগে ফাইনাল চেক (Final Submission Check)

1. Live URL ও Server/Client GitHub repo তে যথেষ্ট মিনিংফুল কমিট ও `README.md` (Admin credentials সহ) আছে কি না নিশ্চিত করুন।
2. টেস্ট অ্যাকাউন্ট (Admin, Technician, Customer) লাইভ সাইটে লগইন করে কাজ করছে কি না একবার শেষবার দেখে নিন।

আপনি এখন **First Step** থেকে শুরু করে কোন ধাপে আছেন বা কোথায় আটকে যাচ্ছেন বললে সেই অনুযায়ী ঠিক করে দিচ্ছি।