import Box from "@mui/material/Box";
import "./bottom_nav.css";
import { styled } from "@mui/material/styles";

//Search Icons
import { ReactComponent as BrowseCategory } from "./icons/BrowseCategory.svg";
import { ReactComponent as ViewAll } from "./icons/ViewAllInv.svg";
import { ReactComponent as NearMe } from "./icons/NearMe.svg";
import { ReactComponent as FindStore } from "./icons/FindStore.svg";

//Sell Icons
import { ReactComponent as Offer } from "./icons/Offer.svg";
import { ReactComponent as Question } from "./icons/Question.svg";

//Finance Icons
import { ReactComponent as Prequalified } from "./icons/Prequalified.svg";
import { ReactComponent as Finance } from "./icons/Finance.svg";

//More Icons
import { ReactComponent as Service } from "./icons/ServiceRepairs.svg";
import { ReactComponent as FAQ } from "./icons/FAQ.svg";
import { ReactComponent as Why } from "./icons/Why.svg";

//My Account Icons
import { ReactComponent as Payment } from "./icons/Payment.svg";
import { ReactComponent as SignIn } from "./icons/SignIn.svg";
import { ReactComponent as CreateAcct } from "./icons/CreateAcct.svg";

const boxStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const RowDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",

  transition: "color .25s ease-in",

  "&:hover": {
    cursor: "pointer",
    color: "var(--primaryColor)",
  },
}));

const iconBox = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  height: "72px",
  width: "72px",
  borderRadius: "16px",
  backgroundColor: "var(--tileBG)",
};

export function SearchSection() {
  return (
    <Box sx={boxStyles}>
      <RowDiv>
        <div style={iconBox}>
          <BrowseCategory className="thumbNavSection_svg" />
        </div>
        <span>Search by category</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <ViewAll className="thumbNavSection_svg" />
        </div>
        <span>See all inventory</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <NearMe className="thumbNavSection_svg" />
        </div>
        <span>Find inventory near me</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <FindStore className="thumbNavSection_svg" />
        </div>
        <span>Find a store</span>
      </RowDiv>
    </Box>
  );
}

export function SellSection() {
  return (
    <Box sx={boxStyles}>
      <RowDiv>
        <div style={iconBox}>
          <Offer className="thumbNavSection_svg" />
        </div>
        <span>Find online offer</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <Question className="thumbNavSection_svg" />
        </div>
        <span>Getting started</span>
      </RowDiv>
    </Box>
  );
}

export function FinanceSection() {
  return (
    <Box sx={boxStyles}>
      <RowDiv>
        <div style={iconBox}>
          <Prequalified className="thumbNavSection_svg" />
        </div>
        <span>Apply for pre-approval</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <Question className="thumbNavSection_svg" />
        </div>
        <span>Getting started</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <Finance className="thumbNavSection_svg" />
        </div>
        <span>Old Cars Ltd Financing</span>
      </RowDiv>
    </Box>
  );
}

export function MoreSection() {
  return (
    <Box sx={boxStyles}>
      <RowDiv>
        <div style={iconBox}>
          <Service className="thumbNavSection_svg" />
        </div>
        <span>Repairs & service</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <FAQ className="thumbNavSection_svg" />
        </div>
        <span>Support and FAQs</span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <Why className="thumbNavSection_svg" />
        </div>
        <span>The Old Cars Ltd Difference</span>
      </RowDiv>
    </Box>
  );
}

export function MyAccountSection() {
  return (
    <Box sx={boxStyles}>
      <RowDiv>
        <div style={iconBox}>
          <Payment className="thumbNavSection_svg" />
        </div>
        <span>
          <b>Submit a payment</b>
        </span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <SignIn className="thumbNavSection_svg" />
        </div>
        <span>
          <b>Sign in</b>
        </span>
      </RowDiv>
      <RowDiv>
        <div style={iconBox}>
          <CreateAcct className="thumbNavSection_svg" />
        </div>
        <span>
          <b>Create an account</b>
        </span>
      </RowDiv>
    </Box>
  );
}
