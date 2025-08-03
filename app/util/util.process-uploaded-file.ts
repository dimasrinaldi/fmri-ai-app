import { GetProp, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export const utilProcessUploadedFile = (
    file: FileType,
    target: ("base64" | "text")
): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (target == "base64") {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
