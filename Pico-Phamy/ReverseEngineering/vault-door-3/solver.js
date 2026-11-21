const FLAG_ENCODED = "jU5t_a_sna_3lpm16gd4e_u_4_m7re42";
let PASSWORD = [];

let i;

for (i = 0; i < 8; i++) {
  PASSWORD[i] = FLAG_ENCODED.at(i);
}
for (; i < 16; i++) {
  PASSWORD[23 - i] = FLAG_ENCODED.at(i);
}
for (; i < 32; i += 2) {
  PASSWORD[46 - i] = FLAG_ENCODED.at(i);
}
for (i = 31; i >= 17; i -= 2) {
  PASSWORD[i] = FLAG_ENCODED.at(i);
}

FLAG = "academy{" + PASSWORD.join("") + "}";
console.log(`Encoded Flag (${FLAG_ENCODED.length}): ${FLAG_ENCODED}`);
console.log(`Decoded Flag (${PASSWORD.length}): ${PASSWORD.join("")}`);
console.log(`Recovered Flag with format: ${FLAG}`);
