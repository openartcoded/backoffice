import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-random-password',
  standalone: false,
  templateUrl: './random-password.component.html',
  styleUrl: './random-password.component.scss',
})
export class RandomPasswordComponent {
  passwordLength: FormControl<number> = new FormControl(16);
  withEmoji: FormControl<boolean> = new FormControl(false);
  withSimpleSpecialCharacters: FormControl<boolean> = new FormControl(true);
  withMoreComplexCharacters: FormControl<boolean> = new FormControl(true);
  withAccentedLetters: FormControl<boolean> = new FormControl(true);
  accentedLetters = 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝÿýÑñÇç';
  complexCharacters = '=+[]{}|;,.<>?$^';
  simpleCharacters = '!@#$€%^&*()-_';
  emojiCharacters =
    '😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁😀😃😄😁😆😅😂🤣🥲😊😇🙂🙃😉😌🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐽🐸🐵🐔🐧🐦🐤🐣🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐜🦗🕷️🦂🐢🐍🦎🐙🦑🦐🦞🐠🐟🐡🐬🐳🐋🦈';
  alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';

  generatedPassword?: string;
  async sha256(input: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  generateSecurePassword(length = 16) {
    let charset = (this.sha256(this.alphaNum + crypto.randomUUID()) + (this.alphaNum + crypto.randomUUID())).split('');

    let specialChars: string[] = [];
    if (this.withSimpleSpecialCharacters.value) {
      specialChars = specialChars.concat(this.simpleCharacters.split(''));
      charset = charset.concat(this.simpleCharacters.split(''));
    }
    if (this.withMoreComplexCharacters.value) {
      specialChars = specialChars.concat(this.complexCharacters.split(''));
      charset = charset.concat(this.complexCharacters.split(''));
    }

    if (this.withAccentedLetters.value) {
      charset = charset.concat(this.accentedLetters.split(''));
    }
    if (this.withEmoji.value) {
      charset = charset.concat(Array.from(this.emojiCharacters));
    }

    const password: string[] = [];
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      password.push(charset[randomValues[i] % charset.length]);
    }

    if (specialChars.length > 0) {
      const randomSpecial = specialChars[randomValues[0] % specialChars.length];
      const randomPos = randomValues[1] % length;
      password[randomPos] = randomSpecial;
    }

    return password.join('');
  }

  generate() {
    const length = this.passwordLength.value || 16;
    this.generatedPassword = this.generateSecurePassword(length);
  }
}
