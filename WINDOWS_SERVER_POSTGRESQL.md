# 💻 PostgreSQL na Windows Server - Kompletny Przewodnik

## 🎯 Wymagania

- Windows Server 2016/2019/2022 lub Windows 10/11
- Co najmniej 2 GB RAM (4 GB zalecane)
- 10 GB wolnego miejsca na dysku
- Uprawnienia administratora

---

## 📥 Instalacja PostgreSQL na Windows Server

### Krok 1: Pobierz PostgreSQL

1. Wejdź na: https://www.postgresql.org/download/windows/
2. Kliknij **Download the installer**
3. Wybierz najnowszą wersję (np. PostgreSQL 16.x)
4. Pobierz instalator dla Windows x86-64

### Krok 2: Uruchom instalator

1. Uruchom pobrany plik `.exe` jako Administrator
2. Kliknij **Next**
3. **Installation Directory**: zostaw domyślną (`C:\Program Files\PostgreSQL\16`)
4. **Select Components**: zaznacz wszystkie:
   - PostgreSQL Server
   - pgAdmin 4
   - Stack Builder
   - Command Line Tools
5. **Data Directory**: zostaw domyślną (`C:\Program Files\PostgreSQL\16\data`)
6. **Password**: Ustaw hasło dla użytkownika `postgres` (ZAPAMIĘTAJ!)
   - Przykład: `PostgreSQL2024!`
7. **Port**: zostaw `5432` (domyślny)
8. **Locale**: wybierz `Polish, Poland` lub zostaw `Default locale`
9. Kliknij **Next** i **Install**
10. Poczekaj na instalację (2-5 minut)
11. Odznacz **Stack Builder** i kliknij **Finish**

### Krok 3: Sprawdź instalację

1. Otwórz **Services** (Win+R → `services.msc`)
2. Znajdź **postgresql-x64-16** (lub podobną nazwę)
3. Sprawdź czy status to **Running**
4. Ustaw **Startup Type** na **Automatic**



## 🛠️ Konfiguracja PostgreSQL

### Krok 1: Otwórz pgAdmin 4

1. Uruchom **pgAdmin 4** z menu Start
2. Ustaw hasło master (do pgAdmin)
3. W lewym panelu: **Servers** → **PostgreSQL 16**
4. Wpisz hasło użytkownika `postgres` (z instalacji)

### Krok 2: Utwórz bazę danych
--
1. Prawy przycisk na **Databases** → **Create** → **Database**
2. **Database**: `park_m_trees`
3. **Owner**: `postgres`
4. Kliknij **Save**

### Krok 3: Utwórz użytkownika (opcjonalnie)

```sql
-- Otwórz Query Tool (prawy przycisk na bazie → Query Tool)

-- Utwórz użytkownika
CREATE USER park_m_user WITH PASSWORD 'TwojeHaslo123!';

-- Nadaj uprawnienia
GRANT ALL PRIVILEGES ON DATABASE park_m_trees TO park_m_user;

-- Nadaj uprawnienia do schematu public
\c park_m_trees
GRANT ALL ON SCHEMA public TO park_m_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO park_m_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO park_m_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO park_m_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO park_m_user;
```

### Krok 4: Konfiguracja dostępu zdalnego (jeśli potrzebne)

#### Edytuj `postgresql.conf`:

1. Otwórz: `C:\Program Files\PostgreSQL\16\data\postgresql.conf`
2. Znajdź linię: `#listen_addresses = 'localhost'`
3. Zmień na: `listen_addresses = '*'`
4. Zapisz plik

#### Edytuj `pg_hba.conf`:

1. Otwórz: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
2. Dodaj na końcu:
```
# Dostęp z sieci lokalnej
host    all             all             192.168.0.0/16          md5
```
3. Zapisz plik

#### Zrestartuj PostgreSQL:

1. Otwórz **Services** (Win+R → `services.msc`)
2. Znajdź **postgresql-x64-16**
3. Prawy przycisk → **Restart**

#### Otwórz port w Firewall:

```powershell
# Uruchom PowerShell jako Administrator
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow
```

---

## ⚙️ Konfiguracja aplikacji Park M

### Krok 1: Skopiuj plik konfiguracyjny

```bash
cp env.example .env.local
```

### Krok 2: Edytuj `.env.local`

#### OPCJA A: Connection String (preferowana)

```bash
# Dla lokalnego serwera
DATABASE_URL=postgresql://postgres:TwojeHaslo@localhost:5432/park_m_trees

# Lub z użytkownikiem park_m_user
DATABASE_URL=postgresql://park_m_user:TwojeHaslo123!@localhost:5432/park_m_trees

# Dla zdalnego serwera
DATABASE_URL=postgresql://park_m_user:TwojeHaslo123!@192.168.1.100:5432/park_m_trees

# Wymuszenie użycia standardowego PostgreSQL
USE_STANDARD_PG=true

NODE_ENV=production
```

#### OPCJA B: Osobne parametry

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=park_m_user
DB_PASSWORD=TwojeHaslo123!
DB_NAME=park_m_trees
DB_SSL=false

USE_STANDARD_PG=true
NODE_ENV=production
```

### Krok 3: Zainstaluj zależności

```bash
npm install
```

### Krok 4: Zainicjalizuj bazę danych

```bash
# Uruchom aplikację
npm run dev

# W przeglądarce otwórz:
http://localhost:3000/api/init-db
```

Powinieneś zobaczyć:
```json
{"message":"Database initialized successfully"}
```

### Krok 5: Zaloguj się

1. Otwórz: http://localhost:3000/login
2. Użyj domyślnych danych:
   - Email: `admin@park-m.pl`
   - Hasło: `password123`

---

## 🚀 Wdrożenie produkcyjne na Windows Server

### Opcja 1: Node.js + PM2 (zalecane)

#### 1. Zainstaluj Node.js

1. Pobierz z: https://nodejs.org/ (wersja LTS)
2. Zainstaluj jako Administrator
3. Sprawdź: `node --version` i `npm --version`

#### 2. Zainstaluj PM2 (Process Manager)

```bash
npm install -g pm2
npm install -g pm2-windows-service

# Zainstaluj PM2 jako usługę Windows
pm2-service-install
```

#### 3. Zbuduj aplikację

```bash
cd C:\inetpub\park-m-trees
npm install
npm run build
```

#### 4. Uruchom z PM2

```bash
pm2 start npm --name "park-m-trees" -- start
pm2 save
pm2 startup
```

#### 5. Sprawdź status

```bash
pm2 status
pm2 logs park-m-trees
```

Aplikacja dostępna na: http://localhost:3000

### Opcja 2: Docker na Windows Server

```bash
# Zainstaluj Docker Desktop for Windows

# Zbuduj obraz
docker build -t park-m-trees .

# Uruchom kontener
docker run -d \
  --name park-m-trees \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/park_m_trees \
  -e USE_STANDARD_PG=true \
  --restart unless-stopped \
  park-m-trees
```

---

## 🔒 Zabezpieczenia

### 1. Firewall

```powershell
# Zezwól tylko z określonych IP
New-NetFirewallRule -DisplayName "PostgreSQL - Local Network" `
  -Direction Inbound -Protocol TCP -LocalPort 5432 `
  -RemoteAddress 192.168.1.0/24 -Action Allow
```

### 2. SSL/TLS dla PostgreSQL

1. Wygeneruj certyfikaty:
```bash
cd "C:\Program Files\PostgreSQL\16\data"

# Użyj OpenSSL (zainstalowany z PostgreSQL)
"C:\Program Files\PostgreSQL\16\bin\openssl.exe" req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj "/CN=localhost"
```

2. Edytuj `postgresql.conf`:
```
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

3. Zrestartuj PostgreSQL

4. Zaktualizuj `.env.local`:
```bash
DB_SSL=true
DATABASE_URL=postgresql://user:pass@host:5432/park_m_trees?sslmode=require
```

### 3. Backup bazy danych

```powershell
# Utwórz skrypt backup (backup-db.ps1)
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "C:\Backups\PostgreSQL"
$backupFile = "$backupPath\park_m_trees_$date.sql"

& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" `
  -U postgres `
  -d park_m_trees `
  -f $backupFile

Write-Host "Backup created: $backupFile"

# Usuń backupy starsze niż 30 dni
Get-ChildItem $backupPath -Filter *.sql | `
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | `
  Remove-Item
```

```powershell
# Zaplanuj w Task Scheduler
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\Scripts\backup-db.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "PostgreSQL Backup" -Description "Daily backup of park_m_trees database"
```

---

## 🛠️ Rozwiązywanie problemów

### Problem: "Connection refused"

**Rozwiązanie:**
1. Sprawdź czy PostgreSQL działa: `services.msc`
2. Sprawdź port: `netstat -an | findstr 5432`
3. Sprawdź firewall: `Get-NetFirewallRule -DisplayName "PostgreSQL"`

### Problem: "password authentication failed"

**Rozwiązanie:**
1. Sprawdź hasło w `.env.local`
2. Zresetuj hasło użytkownika:
```sql
ALTER USER postgres WITH PASSWORD 'NoweHaslo123!';
```

### Problem: "permission denied for schema public"

**Rozwiązanie:**
```sql
GRANT ALL ON SCHEMA public TO park_m_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO park_m_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO park_m_user;
```

### Problem: Aplikacja nie łączy się z bazą

**Rozwiązanie:**
1. Sprawdź logi aplikacji: `npm run dev` (tryb development)
2. Sprawdź logi PostgreSQL: `C:\Program Files\PostgreSQL\16\data\log\`
3. Testuj połączenie:
```bash
psql -h localhost -U postgres -d park_m_trees
```

---

## 📊 Monitorowanie

### pgAdmin 4

1. Otwórz pgAdmin 4
2. Dashboard → Zobacz statystyki serwera
3. Tools → Server Activity → Aktywne połączenia

### Zapytania SQL

```sql
-- Aktywne połączenia
SELECT * FROM pg_stat_activity WHERE datname = 'park_m_trees';

-- Rozmiar bazy
SELECT pg_size_pretty(pg_database_size('park_m_trees'));

-- Rozmiar tabel
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ✅ Checklist wdrożenia

- [ ] PostgreSQL zainstalowany i działa
- [ ] Baza danych `park_m_trees` utworzona
- [ ] Użytkownik bazy danych utworzony (opcjonalnie)
- [ ] `.env.local` skonfigurowany
- [ ] `npm install` wykonane
- [ ] `/api/init-db` uruchomione pomyślnie
- [ ] Logowanie działa (`admin@park-m.pl` / `password123`)
- [ ] Firewall skonfigurowany (jeśli zdalny dostęp)
- [ ] SSL skonfigurowany (dla produkcji)
- [ ] Backup skonfigurowany
- [ ] Aplikacja działa jako usługa (PM2/Docker)

---

## 📝 Podsumowanie

### Zalety PostgreSQL na Windows Server:

✅ **Darmowy i open-source**
✅ **Wydajny i skalowalny**
✅ **Pełna kontrola nad bazą**
✅ **Brak limitów danych**
✅ **Łatwa konfiguracja backupów**
✅ **Działa lokalnie - brak zależności od internetu**
✅ **Kompatybilny z Neon DB (ten sam PostgreSQL)**

### Koszty:

- **PostgreSQL**: 0 zł (darmowy)
- **Windows Server**: Licencja (jeśli nie masz)
- **Hosting**: Twoja infrastruktura

---

**Gotowe! Aplikacja Park M działa z PostgreSQL na Windows Server! 🎉**
