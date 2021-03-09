/*
 * 生成UUID
 * @param format
 */
export const UUID = (format: string = null) => {
    if (format === null) format = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
    return format.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const
            v = c === "x" ? r : (r & 0x3 | 0x8);
        const date = new Date().getTime();
        const d = (v * date).toString(16);
        return d.charAt(Math.random() * d.length | 0);
    });
};

// @ts-ignore
export const UUIDGenerator = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
export default UUID;
