interface User {
  name: string
  role: string
  avatar: string
}

interface UserProfileProps {
  user: User
}

function UserProfile({ user }: UserProfileProps) {
  return (
      <div className="user-profile">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>Role: {user.role}</p>
        </div>
      </div>
  )
}

export default UserProfile