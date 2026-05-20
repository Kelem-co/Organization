'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import { getData } from 'country-list';
import { Check, Search } from 'lucide-react';

interface CountrySearchInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const COUNTRIES = getData().sort((a, b) => a.name.localeCompare(b.name));

export function CountrySearchInput({
  name,
  value,
  onChange,
  placeholder = 'Search for a country',
  required = false,
  className = '',
}: CountrySearchInputProps) {
  const inputId = useId();
  const listboxId = useId();
  const deferredValue = useDeferredValue(value);
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    const query = deferredValue.trim().toLowerCase();

    if (!query) {
      return COUNTRIES;
    }

    const startsWith = COUNTRIES.filter(({ name }) => name.toLowerCase().startsWith(query));
    const contains = COUNTRIES.filter(
      ({ name }) => !name.toLowerCase().startsWith(query) && name.toLowerCase().includes(query)
    );

    return [...startsWith, ...contains];
  }, [deferredValue]);

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />
      <div className={`flex items-center gap-3 ${className}`}>
        <Search className="h-4 w-4 shrink-0 text-primary-navy/40" />
        <input
          id={inputId}
          type="text"
          value={value}
          required={required}
          autoComplete="off"
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-outline-variant bg-white p-2 shadow-xl"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => {
              const selected = country.name === value;

              return (
                <button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onChange(country.name);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-primary-navy transition-colors hover:bg-surface-container"
                >
                  <span>{country.name}</span>
                  {selected ? <Check className="h-4 w-4 text-primary-navy" /> : null}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-primary-navy/50">No matching countries found.</div>
          )}
        </div>
      )}
    </div>
  );
}
