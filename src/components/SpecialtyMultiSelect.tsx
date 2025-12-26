import React from 'react';
import Select from 'react-select';
import { ALL_SPECIALTIES } from '@shared/types';
import { useTheme } from '@/hooks/use-theme';
interface SpecialtyMultiSelectProps {
  selectedSpecialties: string[];
  onChange: (specialties: string[]) => void;
}
const options = ALL_SPECIALTIES.map(specialty => ({ value: specialty, label: specialty }));
export function SpecialtyMultiSelect({ selectedSpecialties, onChange }: SpecialtyMultiSelectProps) {
  const { isDark } = useTheme();
  const handleChange = (selectedOptions: any) => {
    onChange(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };
  const selectedValues = options.filter(option => selectedSpecialties.includes(option.value));
  return (
    <Select
      isMulti
      name="specialties"
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={handleChange}
      value={selectedValues}
      placeholder="Filter by specialties..."
      aria-label="Filter by specialties"
      theme={(theme) => ({
        ...theme,
        borderRadius: 6,
        colors: {
          ...theme.colors,
          primary: isDark ? '#3b82f6' : '#2563eb', // blue-500, blue-600
          primary75: isDark ? '#2563eb' : '#93c5fd',
          primary50: isDark ? '#1e40af' : '#dbeafe',
          primary25: isDark ? '#1e3a8a' : '#eff6ff',
          danger: '#ef4444',
          dangerLight: '#fecaca',
          neutral0: isDark ? 'hsl(var(--muted))' : 'hsl(var(--background))',
          neutral10: isDark ? 'hsl(var(--muted))' : 'hsl(var(--secondary))',
          neutral20: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
          neutral30: isDark ? '#666' : '#ccc',
          neutral40: isDark ? '#888' : '#999',
          neutral50: isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))',
          neutral80: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
        },
      })}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: '4rem',
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          boxShadow: 'none',
          '&:hover': {
            borderColor: 'var(--ring)',
          },
        }),
        input: (base) => ({
          ...base,
          color: 'var(--foreground)',
        }),
        placeholder: (base) => ({
          ...base,
          color: 'var(--muted-foreground)',
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: isDark ? 'hsl(221, 83%, 47%)' : 'hsl(221, 83%, 90%)',
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: isDark ? 'white' : 'hsl(221, 83%, 31%)',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? 'var(--primary)'
            : isFocused
            ? 'var(--accent)'
            : 'transparent',
          color: isSelected
            ? 'var(--primary-foreground)'
            : 'var(--foreground)',
          ':active': {
            backgroundColor: 'var(--primary)',
          },
        }),
      }}
    />
  );
}