import React, { useState } from "react";
import { File, Colors } from "@floatingfile/common";
import { isMobile } from "react-device-detect";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Flex,
  Spacer,
  Button,
  chakra,
  Box,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { FaTrash, FaCloudDownloadAlt } from "react-icons/fa";
import { MdOpenInBrowser } from "react-icons/md";
import useWindowWidth from "../hooks/useWindowWidth";
import useRemoveFile from "../mutations/useRemoveFile";
import { useSelectedFiles } from "../contexts/selectedFiles";
import { saveBlob } from "../utils";
import { BASE_API_URL } from "../env";
import FileIcon from "./FileIcon";

const FileListItem: React.FC<{ file: File }> = ({ file }) => {
  const { name, key, ext, size, signedUrl } = file;
  const { code }: { code: string } = useParams();
  const windowWidth: number = useWindowWidth();
  const { mutateAsync: removeFile } = useRemoveFile(code);
  const { toggleSelect, isSelected } = useSelectedFiles();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  async function download(): Promise<void> {
    if (isMobile) {
      window.open(signedUrl, "_blank");
    } else {
      try {
        setIsDownloading(true);
        if (!signedUrl) return;
        const response = await axios.get(signedUrl, {
          responseType: "blob",
          onDownloadProgress: (event) => {
            setDownloadProgress(event.loaded / event.total);
          },
        });
        const { data } = response;
        await saveBlob(data, name);
        await axios.patch(`${BASE_API_URL}/api/v5/spaces/${code}/history`, {
          action: "DOWNLOAD_FILE",
          payload: key,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsDownloading(false);
      }
    }
  }

  async function remove(): Promise<void> {
    try {
      await removeFile(key);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Flex
      p={2}
      w="100%"
      shadow="md"
      borderRadius="md"
      align="center"
      bg={
        windowWidth > 960
          ? isSelected(key)
            ? "#DDE8F8"
            : "white"
          : Colors.LIGHT_SHADE
      }
      onClick={() => toggleSelect(key)}
      _hover={{ cursor: "pointer" }}
      transition="background-color ease 0.3s"
    >
      <Box w="50px" h="50px">
        <FileIcon extension={ext} previewUrl={file.previewUrl} />
      </Box>
      <Box w="50%">
        <chakra.p textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {name}
        </chakra.p>
        <chakra.p opacity={0.7}>
          {!Number.isNaN(size / 1000)
            ? size > 1000000
              ? `${(size / (1024 * 1024)).toFixed(1)} MB`
              : `${(size / 1024).toFixed(1)} KB`
            : ""}
        </chakra.p>
      </Box>
      <Spacer />
      <Box>
        {windowWidth > 600 ? (
          <>
            <Button colorScheme="blue" onClick={remove} mr="5px">
              Remove
            </Button>
            <Button colorScheme="blue" onClick={download}>
              <chakra.span opacity={isDownloading ? 0 : 1}>
                Download
              </chakra.span>
              <chakra.span
                pos="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              >
                {isDownloading && `${(downloadProgress * 100).toFixed(1)}%`}
              </chakra.span>
            </Button>
          </>
        ) : (
          <>
            <IconButton
              colorScheme="blue"
              onClick={remove}
              aria-label="Remove File"
              icon={<Icon as={FaTrash} />}
              mr="5px"
            />
            <IconButton
              colorScheme="blue"
              onClick={download}
              aria-label="Download File"
              icon={
                <Icon as={isMobile ? MdOpenInBrowser : FaCloudDownloadAlt} />
              }
            />
          </>
        )}
      </Box>
    </Flex>
  );
};

export default FileListItem;
