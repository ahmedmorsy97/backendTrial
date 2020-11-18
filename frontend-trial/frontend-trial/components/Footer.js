import Link from "next/link";
import "../styles/footer.css";

const Footer = (props) => {
  return (
    <>
      <div className="footer" style={{ textAlign: "center", display: "flex" }}>
        <div className="mainHolder">
          <p>© 2020 El-Lista app. All Rights Reserved.</p>
        </div>
      </div>

      <style jsx>{``}</style>
    </>
  );
};

export default Footer;
