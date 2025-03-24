
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { EventCategory, EventModalProps } from '@/types/calendar';
import { Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';

const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  onClose, 
  event, 
  selectedDate,
  onSave,
  onDelete 
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      start: new Date(),
      end: new Date(),
      allDay: false,
      location: '',
      description: '',
      category: 'primary' as EventCategory
    }
  });

  const allDay = watch('allDay');
  const category = watch('category');
  const startDate = watch('start');
  const endDate = watch('end');

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay || false,
        location: event.location || '',
        description: event.description || '',
        category: event.category
      });
    } else if (selectedDate) {
      const endTime = new Date(selectedDate);
      endTime.setHours(endTime.getHours() + 1);
      
      reset({
        title: '',
        start: selectedDate,
        end: endTime,
        allDay: false,
        location: '',
        description: '',
        category: 'primary'
      });
    }
  }, [event, selectedDate, reset]);

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] animate-zoom-in">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Event title" 
                {...register('title', { required: true })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">Title is required</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>All day</Label>
                <Switch 
                  checked={allDay}
                  onCheckedChange={(checked) => setValue('allDay', checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setValue('start', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {!allDay && (
                  <Input
                    type="time"
                    value={startDate ? format(startDate, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newDate = new Date(startDate);
                      newDate.setHours(hours);
                      newDate.setMinutes(minutes);
                      setValue('start', newDate);
                    }}
                  />
                )}
              </div>
              
              <div className="grid gap-2">
                <Label>End</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setValue('end', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {!allDay && (
                  <Input
                    type="time"
                    value={endDate ? format(endDate, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newDate = new Date(endDate);
                      newDate.setHours(hours);
                      newDate.setMinutes(minutes);
                      setValue('end', newDate);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Add location" 
                {...register('location')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Add description" 
                {...register('description')}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Color</Label>
              <RadioGroup 
                value={category} 
                onValueChange={(value) => setValue('category', value as EventCategory)}
                className="flex gap-2 flex-wrap"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="primary" 
                    id="primary" 
                    className="border-calendar-event-primary text-calendar-event-primary" 
                  />
                  <Label htmlFor="primary" className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-calendar-event-primary mr-2" />
                    Blue
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="secondary" 
                    id="secondary" 
                    className="border-calendar-event-secondary text-calendar-event-secondary" 
                  />
                  <Label htmlFor="secondary" className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-calendar-event-secondary mr-2" />
                    Purple
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="success" 
                    id="success" 
                    className="border-calendar-event-success text-calendar-event-success" 
                  />
                  <Label htmlFor="success" className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-calendar-event-success mr-2" />
                    Green
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="warning" 
                    id="warning" 
                    className="border-calendar-event-warning text-calendar-event-warning" 
                  />
                  <Label htmlFor="warning" className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-calendar-event-warning mr-2" />
                    Orange
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="danger" 
                    id="danger" 
                    className="border-calendar-event-danger text-calendar-event-danger" 
                  />
                  <Label htmlFor="danger" className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-calendar-event-danger mr-2" />
                    Red
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="info" 
                    id="info" 
                    className="border-calendar-event-info text-calendar-event-info" 
                  />
                  <Label htmlFor="info" className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-calendar-event-info mr-2" />
                    Light Blue
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center pt-4">
            {event && onDelete && (
              <Button 
                type="button" 
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {event ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
