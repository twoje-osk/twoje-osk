/* eslint-disable react/function-component-definition */
import {
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  Icon,
  Menu,
  MenuItem,
  Popover,
} from '@mui/material';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { useCallback, useState } from 'react';

interface RenderFilterProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
export interface Filter {
  id: string;
  renderFilter: (props: RenderFilterProps) => JSX.Element;
  clearFilter: () => void;
  label: string;
  activeLabel?: string;
  isActive: boolean;
}

interface TableFiltersProps {
  filters: Filter[];
  openedFilter: string | null;
  setOpenedFilter: (newOpenedFilter: string | null) => void;
}

export function TableFilters({
  filters,
  openedFilter,
  setOpenedFilter,
}: TableFiltersProps) {
  const isAnyFilterActive =
    filters.some((filter) => filter.isActive) || openedFilter !== null;
  const areAllFiltersActive = filters.every((filter) => filter.isActive);
  const onClearAll = () => {
    filters.forEach((filter) => filter.clearFilter());
  };

  return (
    <Box
      sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, my: 1 }}
      display="flex"
      alignItems="center"
      gap={1}
    >
      <CreateFilterButton
        filters={filters}
        setOpenedFilter={setOpenedFilter}
        disabled={areAllFiltersActive}
      />

      <Fade in={isAnyFilterActive}>
        <Divider orientation="vertical" />
      </Fade>

      {filters.map((filter) => {
        const isOpen = openedFilter === filter.id;
        return (
          <IndividualFilter
            key={filter.id}
            isOpen={isOpen}
            filter={filter}
            setOpenedFilter={setOpenedFilter}
          />
        );
      })}

      <Box flex="1" />
      <Fade in={isAnyFilterActive}>
        <Button variant="outlined" size="small" onClick={onClearAll}>
          Wyczyść Filtry
        </Button>
      </Fade>
    </Box>
  );
}

interface IndividualFilterProps {
  filter: Filter;
  isOpen: boolean;
  setOpenedFilter: (newOpenedFilter: string | null) => void;
}
function IndividualFilter({
  filter,
  isOpen,
  setOpenedFilter,
}: IndividualFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popupId = `${filter.id}-filter`;

  const open = useCallback(
    () => setOpenedFilter(filter.id),
    [filter.id, setOpenedFilter],
  );
  const close = useCallback(() => setOpenedFilter(null), [setOpenedFilter]);
  const toggle = useCallback(
    () => (isOpen ? close() : open()),
    [close, isOpen, open],
  );

  return (
    <>
      <Fade in={filter.isActive || isOpen} exit={false} unmountOnExit>
        <div>
          <Chip
            key={filter.id}
            variant="outlined"
            label={
              <span>
                <strong>{filter.label}</strong>
                {filter.isActive &&
                  filter.activeLabel &&
                  `: ${filter.activeLabel}`}
              </span>
            }
            size="small"
            onDelete={filter.isActive ? filter.clearFilter : undefined}
            onClick={open}
            color="primary"
            ref={setAnchorEl}
            aria-owns={isOpen ? popupId : undefined}
            aria-haspopup="true"
          />
        </div>
      </Fade>
      <Popover
        id={popupId}
        open={isOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={close}
        disableRestoreFocus
      >
        {filter.renderFilter({
          isOpen,
          open,
          close,
          toggle,
        })}
      </Popover>
    </>
  );
}

interface CreateFilterButtonProps {
  filters: Filter[];
  disabled: boolean;
  setOpenedFilter: (newOpenedFilter: string | null) => void;
}
export const CreateFilterButton = ({
  filters,
  disabled,
  setOpenedFilter,
}: CreateFilterButtonProps) => {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <>
          <Button
            size="small"
            startIcon={<Icon>add</Icon>}
            disabled={disabled}
            color="inherit"
            {...bindTrigger(popupState)}
          >
            Dodaj Filtr
          </Button>
          <Menu
            {...bindMenu(popupState)}
            MenuListProps={{ style: { minWidth: '160px' } }}
          >
            {filters.map((filter) => {
              if (filter.isActive) {
                return null;
              }

              return (
                <MenuItem
                  onClick={() => {
                    setOpenedFilter(filter.id);
                    popupState.close();
                  }}
                  key={filter.id}
                >
                  {filter.label}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </PopupState>
  );
};
