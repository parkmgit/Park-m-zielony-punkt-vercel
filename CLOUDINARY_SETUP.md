# 📸 Konfiguracja Cloudinary - Przechowywanie Zdjęć

## 🎯 Co to jest Cloudinary?

Cloudinary to serwis do przechowywania i zarządzania zdjęciami w chmurze. Używamy go do:
- ✅ Przechowywania zdjęć drzew
- ✅ Automatycznej optymalizacji obrazów
- ✅ Generowania miniatur
- ✅ Bezpiecznego dostępu do zdjęć

## 🆓 Darmowy Plan

- **25 GB** storage
- **25 GB** bandwidth/miesiąc
- **Bez karty kredytowej!**

---

## 📝 Krok 1: Utwórz konto Cloudinary

1. Wejdź na: https://cloudinary.com/users/register_free
2. Wypełnij formularz:
   - Email
   - Hasło
   - Cloud name (np. `park-m-trees`)
3. Kliknij **Create Account**
4. Potwierdź email

---

## 🔑 Krok 2: Pobierz dane dostępowe

Po zalogowaniu zobaczysz **Dashboard**:

1. W sekcji **Account Details** znajdziesz:
   ```
   Cloud name: park-m-trees
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```

2. **Skopiuj te dane!**

---

## ⚙️ Krok 3: Dodaj zmienne środowiskowe

### Dla Vercel:

1. Wejdź na: https://vercel.com/dashboard
2. Wybierz projekt
3. **Settings** → **Environment Variables**
4. Dodaj 3 zmienne:

```
CLOUDINARY_CLOUD_NAME=park-m-trees
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

5. Wybierz **Production, Preview, and Development**
6. Kliknij **Save**

### Dla lokalnego developmentu:

1. Otwórz plik `.env.local`
2. Dodaj:

```env
CLOUDINARY_CLOUD_NAME=park-m-trees
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

## 🚀 Krok 4: Redeploy aplikacji

### Na Vercel:

1. **Deployments** → kliknij **...** → **Redeploy**

### Lokalnie:

```bash
npm run dev
```

---

## ✅ Krok 5: Testowanie

1. Otwórz aplikację
2. Dodaj nowe drzewo
3. Dodaj zdjęcie
4. Sprawdź czy zdjęcie się zapisało

### Sprawdź w Cloudinary:

1. Wejdź na: https://cloudinary.com/console
2. **Media Library**
3. Folder `park-m-trees`
4. Powinieneś zobaczyć przesłane zdjęcia

---

## 🔧 Jak to działa?

### W bazie danych zapisujemy tylko URL:

```sql
photos
├── id
├── entity_type (tree, tree_action)
├── entity_id
├── filename (cloudinary public_id)
├── url (https://res.cloudinary.com/...)
└── taken_by
```

### Zdjęcia są przechowywane na Cloudinary:

```
https://res.cloudinary.com/park-m-trees/image/upload/v1234567890/park-m-trees/tree_abc123.jpg
```

---

## 📊 Monitorowanie użycia

1. Wejdź na: https://cloudinary.com/console
2. **Dashboard** → **Usage**
3. Sprawdź:
   - Storage (max 25 GB)
   - Bandwidth (max 25 GB/miesiąc)
   - Transformations

---

## 🔐 Bezpieczeństwo

✅ **Zmienne środowiskowe są bezpieczne:**
- Nie są commitowane do Git (`.env.local` jest w `.gitignore`)
- Są dostępne tylko na serwerze
- Nie są widoczne w przeglądarce

✅ **Upload jest zabezpieczony:**
- Tylko zalogowani użytkownicy mogą dodawać zdjęcia
- Zdjęcia są przypisane do konkretnych drzew/akcji

---

## ❓ Rozwiązywanie problemów

### Problem: "Missing required parameter - file"

**Rozwiązanie:**
- Sprawdź czy zmienne `CLOUDINARY_*` są ustawione
- Zrestartuj serwer (`npm run dev`)

### Problem: "Invalid API Key"

**Rozwiązanie:**
- Sprawdź czy API Key i API Secret są poprawnie skopiowane
- Upewnij się że nie ma spacji na początku/końcu

### Problem: "Upload failed"

**Rozwiązanie:**
- Sprawdź czy zdjęcie nie jest za duże (max 10 MB na darmowym planie)
- Sprawdź czy nie przekroczyłeś limitu storage (25 GB)

---

## 📚 Więcej informacji

- Dokumentacja: https://cloudinary.com/documentation
- Dashboard: https://cloudinary.com/console
- Support: https://support.cloudinary.com

---

## 🎉 Gotowe!

Teraz zdjęcia są bezpiecznie przechowywane w chmurze Cloudinary, a w bazie danych zapisujemy tylko URL do nich.

**Korzyści:**
- ✅ Nieograniczona liczba zdjęć (do 25 GB)
- ✅ Automatyczna optymalizacja
- ✅ Szybkie ładowanie
- ✅ Backup w chmurze
- ✅ 0 zł/miesiąc!
