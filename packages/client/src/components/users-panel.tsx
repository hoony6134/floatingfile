import React from "react";
import { useParams } from "react-router-dom";
import FaceIcon from "@material-ui/icons/Face";
import { Box, Stack, chakra, Flex } from "@chakra-ui/react";
import { Colors } from "@floatingfile/common";
import useSpace from "../queries/useSpace";
import Panel from "./panel";

interface UsersPanelProps {
  myClientId?: string;
}

const UsersPanel: React.FC<UsersPanelProps> = ({ myClientId }) => {
  const { code }: { code: string } = useParams();
  const { data: space } = useSpace(code);
  const users = space?.users || [];

  return (
    <Panel title="Users">
      <Stack spacing={3}>
        {users.map(({ username, id }) => (
          <Flex
            key={username}
            bg={Colors.LIGHT_SHADE}
            borderRadius="md"
            shadow="base"
            align="center"
            h="52px"
            p="5px"
          >
            <Box mr="10px">
              <FaceIcon
                style={{ color: username?.split("-")[0], fontSize: 36 }}
              />
            </Box>
            <Box>
              <chakra.p
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {username}
              </chakra.p>
              {myClientId === id && <chakra.p opacity={0.7}>(me)</chakra.p>}
            </Box>
          </Flex>
        ))}
      </Stack>
    </Panel>
  );
};

export default UsersPanel;
