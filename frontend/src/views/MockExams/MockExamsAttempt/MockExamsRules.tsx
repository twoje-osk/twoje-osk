import { Flex } from 'reflexbox';
import {
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { DriversLicenseCategoryFindAllResponseDto } from '@osk/shared';
import { useState } from 'react';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { PicklistOption } from '../../../components/FPicklistField/FPicklistField';

export const MockExamsRules = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const { data: categoriesData, error } =
    useSWR<DriversLicenseCategoryFindAllResponseDto>(
      '/api/drivers-license-categories',
    );

  if (error) {
    return <GeneralAPIError />;
  }

  const categoriesOptions: PicklistOption[] = categoriesData?.categories
    ? categoriesData.categories.map((el) => {
        return { value: el.id, label: el.name };
      })
    : [];

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCategory(+event.target.value);
  };
  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" component="h1">
          Egzamin teoretyczny
        </Typography>
      </Toolbar>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        style={{ margin: '32px auto auto 32px' }}
      >
        <Typography variant="h6">Zasady ogólne</Typography>
        <Typography variant="subtitle1">
          Egzamin składa się z dwóch części. Do uzyskania wyniku pozytywnego
          konieczne jest zdobycie łącznie <strong>68 z 74</strong> możliwych
          punktów.
        </Typography>
        <Typography variant="h6" style={{ marginTop: '24px' }}>
          Część podstawowa (20 pytań)
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">- 10 pytań za 3 punkty</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">- 6 pytań za 2 punkty</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">- 4 pytania za 1 punky</Typography>
          </ListItem>
        </List>
        <Typography variant="subtitle1">
          Na zapoznanie się z pytaniem podstawowym masz maksymalnie{' '}
          <strong>20 sekund</strong>.
        </Typography>
        <Typography variant="subtitle1">
          Jeśli przeczytasz pytanie wcześniej, możesz kliknąć{' '}
          <strong>&apos;Start&apos;</strong>.
        </Typography>
        <Typography variant="subtitle1">
          Na wybranie odpowiedzi &apos;Tak&apos; lub &apos;Nie&apos; będziesz
          mieć maksymalnie <strong>15 sekund</strong>.
        </Typography>

        <Typography variant="h6" style={{ marginTop: '24px' }}>
          Część specjalistyczna (12 pytań)
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">- 6 pytań za 3 punkty</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">- 4 pytania za 2 punkty</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">- 2 pytania za 1 punkt</Typography>
          </ListItem>
        </List>
        <Typography variant="subtitle1">
          Na zapoznanie się z pytaniem specjalistycznym masz maksymalnie{' '}
          <strong>50 sekund</strong>.
        </Typography>
        <Typography variant="subtitle1">
          Należy w tym czasie wybrać <strong>jedną</strong> odpowiedź.
        </Typography>
      </Flex>
      <Flex
        style={{
          marginTop: '32px',
          marginLeft: 'auto',
          marginRight: 'auto',
          gap: '8px',
        }}
      >
        <FormControl variant="outlined">
          <InputLabel id="label">Kategoria</InputLabel>
          <Select
            labelId="label"
            onChange={handleChange}
            label="Kategoria"
            disabled={categoriesData === undefined}
            style={{ width: '200px' }}
          >
            {categoriesOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={() => navigate(`./${selectedCategory}`)}
          variant="contained"
          disabled={selectedCategory === undefined}
          style={{
            height: 'fit-content',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          Rozpocznij egzamin
        </Button>
      </Flex>
    </Flex>
  );
};
