"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useMeProfileQuery,
  useUpdateMeProfileMutation,
} from "@/queries/useAccount";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useUploadMediaMutation } from "@/queries/useMedia";

export default function UpdateProfileForm() {
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "",
      avatar: undefined,
    },
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  //lấy avatar từ form
  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [avatar, file]);

  //lay data fetch tu api getMe de hien thi thay the cho cac gia tri mac dinh
  const { data, refetch } = useMeProfileQuery();
  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data;
      form.reset({
        name,
        avatar: avatar ?? undefined,
      });
    }
  }, [form, data]);

  const reset = () => {
    form.reset();
    setFile(null);
  };

  const updateAvatar = useUploadMediaMutation();
  const updateProfile = useUpdateMeProfileMutation();
  const onSubmit = async (data: UpdateMeBodyType) => {
    if (updateProfile.isPending) return;
    try {
      //check xem có upload file cho avatar không
      let body = data;
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);
        const uploadAvatarResult = await updateAvatar.mutateAsync(formData);
        const imageUrl = uploadAvatarResult.payload.data;
        body = { ...data, avatar: imageUrl };
      }
      const result = await updateProfile.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      refetch();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.warn(error);
        })}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none">
                          {name}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              "http://localhost:3000/" + field.name
                            );
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
