export class ClipboardUtil {

    static copyToClipboard(text: string) {
        const tempInput = document.createElement("input");
        tempInput.style.setProperty('position', 'absolute');
        tempInput.style.setProperty('left', '-1000px');
        tempInput.style.setProperty('top', '-1000px');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

}