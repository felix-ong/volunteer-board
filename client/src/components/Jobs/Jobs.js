import { useContext, useEffect, useState } from "react";
import JobsApi from "../../apis/JobsApi";
import { JobsContext } from "../../context/JobsContext";
import { Link } from "react-router-dom";
import Job from "./Job/Job";
import SearchBar from "../SearchBar";
import CategoryFilter from "../CategoryFilter";
import PaginationLimit from "../PaginationLimit/PaginationLimit";
import { Box, Button, Grid } from "@material-ui/core";
import ROLES from "../../utils/roles";

const Jobs = () => {
  const user = JSON.parse(localStorage.getItem("profile"));

  const { jobs, setJobs } = useContext(JobsContext);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const allowedToAddJob = () => {
    const userRole = user?.result?.role;
    return user && userRole && userRole !== ROLES.Student;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const categoriesString = filteredCategories.join(",");

        const res = await JobsApi.get(
          `/?page=${page}&limit=${limit}&search=${encodeURIComponent(
            searchTerm
          )}&categories=${encodeURIComponent(categoriesString)}`
        );
        setJobs(res.data.data);
        setPage(res.data.page);
        setPageCount(res.data.pageCount);
        setLimit(res.data.limit);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, [page, limit, searchTerm, filteredCategories, setJobs]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>Available Jobs</h1>
        {allowedToAddJob() && (
          <Link to="/jobs/new">
            <Button variant="contained" color="primary">
              Add Job
            </Button>
          </Link>
        )}
      </Box>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setPage={setPage}
      />
      <CategoryFilter
        filteredCategories={filteredCategories}
        setFilteredCategories={setFilteredCategories}
        setPage={setPage}
      />
      {/* DateFilter */}

      {jobs && (
        <>
          <Box marginTop={3}>
            <Grid container spacing={6}>
              {jobs.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </Grid>
          </Box>
          <PaginationLimit
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            limit={limit}
            setLimit={setLimit}
            itemName="Jobs"
          />
        </>
      )}
    </>
  );
};

export default Jobs;
