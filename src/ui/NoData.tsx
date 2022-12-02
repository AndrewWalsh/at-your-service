import { Grid, Text } from "@geist-ui/core";

export default function NoData() {
  return (
    <Grid.Container justify="center" gap={1} alignItems="center" height="250px">
      <Grid>
        <Text>No data to show</Text>
      </Grid>
    </Grid.Container>
  );
}
