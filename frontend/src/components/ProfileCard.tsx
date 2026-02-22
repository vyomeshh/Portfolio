function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="avatar"></div>
      <h3>Your Name</h3>
      <p className="role">Full Stack Developer</p>

      <div className="info">
        <p>📧 your@email.com</p>
        <p>📍 India</p>
        <p>💼 Available for work</p>
      </div>

      <div className="socials">
        <button>GitHub</button>
        <button>LinkedIn</button>
      </div>
    </div>
  );
}

export default ProfileCard;