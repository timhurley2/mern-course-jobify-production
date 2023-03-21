import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";
import { useState, useMemo } from "react";
const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
    limit,
  } = useAppContext();
  const handleSearch = (e) => {
    if (isLoading) {
      return;
    }
    handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearch('');
    clearFilters();
  }
  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value)
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange({name: e.target.name, value: e.target.value})
      }, 1000)
    }
  }
  const optimizedDebounce = useMemo(() => debounce(), [])
  const values = Array.from({ length: 16 }, (_, index) => {
    return index + 5;
  });
  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          <FormRowSelect
            labelText="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            labelText="type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <FormRowSelect
          labelText="number per page"
            name="limit"
            value={limit}
            handleChange={handleSearch}
            list={values}

          />
          <button className="btn btn-block btn-danger" disabled={isLoading} onClick={handleSubmit}>
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default SearchContainer;
