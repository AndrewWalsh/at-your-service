import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FcCommandLine, FcIdea, FcParallelTasks } from "react-icons/fc";
import { DiGithubFull, DiNpm } from "react-icons/di";

import {
  COLOR_PRIMARY_BORDER,
  COLOR_PRIMARY,
  COLOR_WHITE,
  COLOR_TERTIARY,
  COLOR_SECONDARY,
} from "./constants";

export type KV = Array<[key: string, value: string]>;

type Props = {
  onChange: (kv: KV) => void;
  title: string;
};

function KeyValue({ onChange, title }: Props) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [kv, setKv] = useState<KV>([]);

  useEffect(() => {
    onChange(kv);
  }, [kv]);

  const isValid = Boolean(key && value);

  const onClickAdd = () => {
    setKv((prev) => {
      const filtered = prev.filter(([k, v]) => {
        return k !== key;
      });
      return [...filtered, [key, value]];
    });
    setKey("");
    setValue("");
  };

  const onClickDelete = (key: string) => {
    setKv((prev) => {
      return prev.filter(([k, v]) => {
        return k !== key;
      });
    });
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>
          <Box display="flex" alignItems="center" flexFlow="row nowrap">
            <Button
              disabled={!isValid}
              bg={COLOR_SECONDARY}
              colorScheme="blue"
              color={COLOR_WHITE}
              marginRight="8px"
              onClick={onClickAdd}
            >
              Add
            </Button>
            <Text>{title}</Text>
          </Box>
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Key</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {kv.map(([key, value]) => (
            <Tr cursor="pointer" key={key}>
              <Td onClick={() => onClickDelete(key)}>{key}</Td>
              <Td onClick={() => onClickDelete(key)}>{value}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>
              <Input
                variant="flushed"
                placeholder="Key"
                onChange={(e) => setKey(e.target.value)}
                value={key}
              />
            </Th>
            <Th>
              <Input
                variant="flushed"
                placeholder="Value"
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}

export default KeyValue;
