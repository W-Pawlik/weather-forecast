import { Autocomplete, TextField, InputAdornment, CircularProgress, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { CityOption } from '@/data/cities';
import { useDebounced } from '@/utils/debounceF';
import { searchCities } from '@/services/searchCities';

const sanitize = (s: string) => s.replace(/[^\p{L}\s-]/gu, '');

const labelOf = (o: CityOption) =>
  `${o.name}${o.region ? `, ${o.region}` : ''}${o.country ? `, ${o.country}` : ''}`;

export default function CitySearch() {
  const nav = useNavigate();
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounced(input, 200);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = () => {
      inputRef.current?.focus();
      setFocused(true);
    };

    window.addEventListener('focus-city-search', handler);
    return () => {
      window.removeEventListener('focus-city-search', handler);
    };
  }, []);

  useEffect(() => {
    const q = sanitize(debounced.trim());
    if (!focused || q.length === 0) {
      setOptions([]);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    searchCities(q, 6, 120).then((res) => {
      if (!alive) return;
      setOptions(res);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [debounced, focused]);

  const shouldOpen = focused && sanitize(input).trim().length > 0;

  return (
    <Box
      sx={(t) => ({
        ml: 'auto',
        width: { xs: 180, sm: 220, md: 260 },
        maxWidth: '70vw',
        transition: t.transitions.create('width', { duration: t.transitions.duration.shorter }),
        '&:focus-within': { width: { xs: 260, sm: 340, md: 420 } },
      })}
    >
      <Autocomplete<CityOption>
        open={shouldOpen && (options.length > 0 || loading)}
        options={options}
        loading={loading}
        autoComplete
        includeInputInList
        filterOptions={(x) => x}
        getOptionLabel={(o) => labelOf(o)}
        isOptionEqualToValue={(a, b) =>
          a.name === b.name && a.country === b.country && a.region === b.region
        }
        inputValue={input}
        onInputChange={(_, v) => setInput(v)}
        forcePopupIcon={false}
        disableClearable={false}
        openOnFocus={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(_, val) => {
          if (val) {
            const cityName = (val as CityOption).name;
            setInput(cityName);
            nav(`/${encodeURIComponent(cityName)}`);
          }
        }}
        renderOption={(props, option) => (
          <li {...props} key={`${option.name}-${option.country ?? ''}-${option.region ?? ''}`}>
            {labelOf(option)}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
            placeholder="Search city…"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: (t) =>
                  t.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.95)',
                borderRadius: 2,
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText={sanitize(input).trim().length === 0 ? '' : 'No results'}
        loadingText="Searching…"
        slotProps={{ paper: { elevation: 6 } }}
      />
    </Box>
  );
}
