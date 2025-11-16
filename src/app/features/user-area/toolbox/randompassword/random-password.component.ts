import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-random-password',
    standalone: false,
    templateUrl: './random-password.component.html',
    styleUrl: './random-password.component.scss'
})
export class RandomPasswordComponent {
    passwordLength: FormControl<number> = new FormControl(16);
    withEmoji: FormControl<boolean> = new FormControl(false);
    withSimpleSpecialCharacters: FormControl<boolean> = new FormControl(true);
    withMoreComplexCharacters: FormControl<boolean> = new FormControl(true);
    withAccentedLetters: FormControl<boolean> = new FormControl(true);
    accentedLetters = "ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝÿýÑñÇç";
    complexCharacters = "=+[]{}|;,.<>?$^";
    simpleCharacters = "!@#$€%^&*()-_";
    emojiCharacters = "😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁😀😃😄😁😆😅😂🤣🥲😊😇🙂🙃😉😌🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐽🐸🐵🐔🐧🐦🐤🐣🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐜🦗🕷️🦂🐢🐍🦎🐙🦑🦐🦞🐠🐟🐡🐬🐳🐋🦈";
    alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789";

    generatedPassword?: string;

    generateSecurePassword(length = 16) {
        let charset = (this.alphaNum + crypto.randomUUID()).split('');

        if (this.withAccentedLetters.value) {
            charset = charset.concat(this.accentedLetters.split(''));
        }
        if (this.withSimpleSpecialCharacters.value) {
            charset = charset.concat(this.simpleCharacters.split(''));
        }
        if (this.withMoreComplexCharacters.value) {
            charset = charset.concat(this.complexCharacters.split(''));
        }
        if (this.withEmoji.value) {
            charset = charset.concat(Array.from(this.emojiCharacters));
        }

        const password = [];
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            password.push(charset[randomValues[i] % charset.length]);
        }

        return password.join("");
    }

    generate() {
        const length = this.passwordLength.value || 16;
        this.generatedPassword = this.generateSecurePassword(length);
    }
}
