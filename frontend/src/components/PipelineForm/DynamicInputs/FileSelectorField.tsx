import React, { useEffect, useState } from 'react';
import { useFormContext } from "react-hook-form";
import { FileSelector } from "../../Uploader";
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

interface FileSelectorProps {
  name: string;
  uploader: any;  
  plugins: any[];
  readyStatus?: { [key: string]: boolean | null };
  setReadyStatus?: React.Dispatch<React.SetStateAction<{ [key: string]: boolean | null }>>;
  [key: string]: any;
}

const FileSelectorField: React.FC<FileSelectorProps> = ({
  name,
  uploader,
  plugins,
  readyStatus,
  setReadyStatus,
  ...fileSelectorProps
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const { register, setValue, formState } = useFormContext();

  useEffect(() => {
    const handleFilesAdded = (uppy_files: { data: { name: string } }[]) => {
      setFiles((prevFiles) => [...prevFiles, ...uppy_files.map((a) => a.data.name)]);
    };

    const handleFileRemoved = (file: { name: string }, reason: string) => {
      setFiles((prevFiles) => {
        if (reason === "cancel-all" || !prevFiles.length) {
          return [];
        }
        return prevFiles.filter((e) => e !== file.name);
      });
    };

    const handleCancelAll = () => {
      setFiles([]);
      setReadyStatus?.((prevState) => ({ ...prevState, [name]: null }));
    };

    const handleError = (error: Error) => {
      console.log(error);
      setFiles([]);
    };

    const handleComplete = (result: { successful: any[] }) => {
      setReadyStatus?.((prevState) => ({
        ...prevState,
        [name]: result.successful.length > 0 ? true : false,
      }));
      setFiles([]);
    };

    uploader.on("files-added", handleFilesAdded);
    uploader.on("file-removed", handleFileRemoved);
    uploader.on("cancel-all", handleCancelAll);
    uploader.on("error", handleError);
    uploader.on("complete", handleComplete);

    return () => {
      uploader.off("files-added", handleFilesAdded);
      uploader.off("file-removed", handleFileRemoved);
      uploader.off("cancel-all", handleCancelAll);
      uploader.off("error", handleError);
      uploader.off("complete", handleComplete);
    };
  }, [files, readyStatus, name]);

  useEffect(() => {
    register(name, { required: true });
  }, [name, register]);

  useEffect(() => {
    if (files.length === 0) {
      setValue(name, null);
    } else {
      setValue(name, files, { shouldValidate: true });
    }
  }, [files, name, setValue]);

  return (
    <>
      <Box sx={{ border: formState.errors[name] ? '2px solid red' : undefined }}>
        <FileSelector
          name={name}
          uploader={uploader}
          plugins={plugins}
          {...fileSelectorProps}
        />
      </Box>
      {formState.errors[name] && (
        <FormHelperText error>
          {formState.errors[name]?.message}
        </FormHelperText>
      )}
    </>
  );
};

export default FileSelectorField;
