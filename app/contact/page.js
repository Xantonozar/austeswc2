"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Mail, Phone, Send, CheckCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import  Input  from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@/shared/schema";
import Link from "next/link";
const inputVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const iconVariants = {
  initial: { rotate: 0 },
  animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: "linear" } }
};

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // const mutation = useMutation({
  //   mutationFn: (data) =>
  //     apiRequest("POST", "/api/contact", data),
  //   onSuccess: () => {
  //     setIsSuccess(true);
  //     setTimeout(() => setIsSuccess(false), 2000);
  //     toast({
  //       title: "Message sent",
  //       description: "We'll get back to you soon!",
  //     });
  //     form.reset();
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Error",
  //       description: "Failed to send message. Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  //   onSettled: () => {
  //     setIsSubmitting(false);
  //   },
  // });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
          
                <MapPin className="h-6 w-6 text-primary" />
              
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  141 & 142 Love Road, Tejgaon I/A<br />
                  Dhaka-1208, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              
                <Mail className="h-6 w-6 text-primary" />
             
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">austeswc@aust.edu</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
          
                <Phone className="h-6 w-6 text-primary" />
     
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">+880 2 8870422</p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <Separator orientation="vertical" className="absolute left-0 top-0 h-full hidden md:block" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:pl-12"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <motion.div variants={inputVariants} whileHover="hover">
                            <Input 
                              placeholder="Your name" 
                              {...field}
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <motion.div variants={inputVariants} whileHover="hover">
                            <Input 
                              placeholder="Your email" 
                              {...field}
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <motion.div variants={inputVariants} whileHover="hover">
                            <Textarea
                              placeholder="Your message"
                              className="min-h-[120px] transition-all duration-300 focus:scale-[1.02]"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
<Link href="/coming">
<Button
                        type="submit"
                        className="w-full group"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Send className="h-4 w-4" />
                          </motion.div>
                        ) : isSuccess ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message
                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                      </Button>
</Link>
                      
                    </motion.div>
                  </AnimatePresence>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}