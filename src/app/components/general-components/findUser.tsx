import { useState } from "react";
import { ConfigProvider, Select, Spin } from "antd";
import UserAvatar from "./user/userAvatar";
import { useDebounce } from "@libs/hooks/common/useDebounce";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";
import { useParams } from "react-router-dom";

interface FindUserProps {
  value: string[];
  onChange: (userIds: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  excludeUserIds?: string[];
}

const FindUser = ({
  value,
  onChange,
  label,
  placeholder = "e.g. Maria, maria@company.com",
  className,
  excludeUserIds,
}: FindUserProps) => {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const { projectId } = useParams();
  const { projectMembers, isLoading } = useProjectMembers({
    project_id: projectId || "",
    name: debouncedKeyword,
    email: debouncedKeyword,
  });

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#22c55e",
              colorSuccess: "#16a34a",
              colorError: "#dc2626",
              colorWarning: "#f59e0b",
              borderRadius: 0,
            },
            components: {
              Select: {
                padding: 12,
              },
            },
          }}
        >
          <Select
            className={`w-full`}
            mode="multiple"
            searchValue={keyword}
            value={value}
            showSearch={true}
            onChange={(newValue) => {
              setKeyword("");
              onChange(newValue as string[]);
            }}
            loading={isLoading}
            notFoundContent={
              isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-gray-500">
                  {keyword.length > 0
                    ? "No users found"
                    : "Start typing to search"}
                </div>
              )
            }
            filterOption={false}
            options={
              keyword.length
                ? projectMembers
                    ?.filter(
                      (user: any) => !excludeUserIds?.includes(user.user_id),
                    )
                    .map((user: any) => ({
                      label: (
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            userId={user.user_id}
                            isDisplayName={true}
                          />
                        </div>
                      ),
                      value: user.user_id,
                    }))
                : []
            }
            onSearch={(v) => setKeyword(v)}
            placeholder={placeholder}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default FindUser;
